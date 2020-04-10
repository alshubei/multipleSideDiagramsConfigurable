require('normalize.css/normalize.css');
require('styles/App.scss');


import React, { Component } from 'react';
import _ from 'lodash'

class AppComponent extends Component {
	constructor(props) {
		super(props);
		this.connect = this.connect.bind(this)
        this.state = {
			partitions: [{name: "<PARTITION-NAME>"}]
        }
    }

    componentDidMount() {
		//fetch("../dataSmall.json")				
		fetch("../dataLarge.json")
		.then((response) => response.json())
		.then((data) => this.setState({ "partitions": data.partitions.sort(sortByName) , "portsWhitelist": data.portsWhitelist}))
    }
	
	connect(vdp) {
		const state = this.state
		const allComponents = _.flattenDepth(state.partitions.map(x=>x.clusters.map(x=>x.components)), 2)
		const allVdps = _.flattenDepth(allComponents.map(c=>c.ports.map(p=>p.vdps)), 2)
		allVdps.forEach(v=>{
			if(v!==vdp)
				v.connected=""
		})
		vdp.connected = (vdp.connected=="connected" ? "" : "connected")
		const rPorts = vdp.rPorts
		const reqComps = rPorts.map(x=>x.requiringComponent)
		reqComps.forEach(rc => {
			const xs = rc.split("/")
			const partitionIndex = state.partitions.findIndex(p=>p.name==xs[0])
			const clusterIndex = state.partitions[partitionIndex].clusters.findIndex(c=>c.name==xs[1])
			const component = state.partitions[partitionIndex].clusters[clusterIndex].components.find(c=>c.name==xs[2])
			component.connected=(component.connected=="connected" ? "" : "connected")
		});
		allComponents.forEach(c=>{
			if (!reqComps.find(rc=>rc.split("/")[2]==c.name))
				c.connected=""
		})
		this.setState({ state })
	}

	render() {		
		const state = this.state
		const partitionDiagrams = [].concat(this.state.partitions).filter(p=>isRtePartition(p, state)).map((partition, dx)=>{
			return <PartitionDiagram partition={partition}  key={dx}  index={dx} state={state} funcs={{"connect": this.connect}}/>;
		});
		return (
			<div className = "fbx partitions">{partitionDiagrams}</div>
			);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;




class PartitionDiagram extends Component  {
	render() {
		const { partition, index, funcs, state } = this.props
		return 	<div className={"item partition "} key={index}>
					{partition.name}
					<div className="fbx clusters">						
						{(partition.clusters || []).filter(c=>isRteCluster(c, state)).sort(sortByName).map((cluster, dx)=>{
							return <ClusterDiagram cluster={cluster} key={dx} state={state} partitionIndex={index} index={dx} funcs={funcs} />})}
					</div>				
				</div>
	}
}

class ClusterDiagram extends Component {
	render() {
		const { cluster, index, partitionIndex, funcs, state } = this.props
		let Diagrams = (cluster.components || []).sort(sortByName).filter(c=>isRteComponent(c, state)).map((component, dx)=>{
			return <ComponentDiagram component={component} key={dx}  state={state} index={dx} partitionIndex={partitionIndex} clusterIndex={index} funcs={funcs} />})
		return <div className="item cluster" key={index}>						
					{cluster.name}
					<div className="fbx components">
						{Diagrams}
					</div>	
				</div>
	}
}

class ComponentDiagram extends Component {
	render() {
		const { component, index, partitionIndex, clusterIndex, funcs, state } = this.props
		return <div className={"item component " + (component.connected ? "connected" : "")} key={index}>					
					{component.name}
					<div className="fbx ports">
						{(component.ports || []).sort(sortByName).filter(p=>isRtePort(p, state)).map((port, dx)=>{
							return <PortDiagram port={port} key={dx} index={dx} partitionIndex={partitionIndex} clusterIndex={clusterIndex} componentIndex={index} state={state} funcs={funcs} />
						})}
					</div>			
				</div>
	}
}

class PortDiagram extends Component {
	render() {
		const { port, index,  partitionIndex, clusterIndex, componentIndex, funcs, state } = this.props	
		if (state.portsWhitelist && state.portsWhitelist.length && !state.portsWhitelist.find(n=>n==port.name)) {
			return null
		}
		const vdps = port.vdps.sort(sortByName).filter(v=>isRteVdp(v, state)).map(
			(vdp, dx)=><Vdp vdp={vdp} key={dx} state={state} index={dx} partitionIndex={partitionIndex} clusterIndex={clusterIndex} componentIndex={componentIndex} portIndex={index} funcs={funcs} />)
		return <div className="item port" key={index}>
			<div className="tooltip">{'p'+(index+1)}<span className="tooltiptext">{port.name}</span></div> 
			<br/>
			<div className="fbx vdps">
				{vdps}
			</div>
		</div>
	}
}

class Vdp extends Component {
	render() {
		const { vdp, state, index, partitionIndex, clusterIndex, componentIndex, portIndex, funcs} = this.props	
		const Desc = (vdp.rPorts && vdp.rPorts.length) ? [].concat(vdp.rPorts.map(rp=>rp.requiringComponent)).sort().map((x, dx)=><div key={dx}>{x}</div>) : <div key={index}>no_reqs</div>
		return <div className={vdp.name + " item vdp tooltip "+(vdp.connected ? "connected" : "")} key={index} onClick={()=>clickVdp(vdp, funcs, state)} >{'vdp'+(index+1)}<span className="tooltiptext">{Desc}</span></div>
	}
} 

const clickVdp = (vdp, funcs, state) => {
	funcs.connect(vdp)
}

const isRtePartition = (p, state) => {
	return  p && p.clusters && p.clusters.length && p.clusters.find(c=>isRteCluster(c, state))
} 

const isRteCluster = (c, state) => {
	return  c && c.components && c.components.length && c.components.find(c=>isRteComponent(c, state))
} 

const isRteComponent = (c, state) => {	
	return  c && c.ports && c.ports.length //&& c.ports.find(p=>isRtePort(p, state))
}

const isRtePort = (p, state) => {
	return p && ((!state.portsWhitelist || !state.portsWhitelist.length) || state.portsWhitelist.find(n=>n==p.name))
}

const isRteVdp = (vdp, state) => {
	return vdp && ((!state.portsWhitelist || !state.portsWhitelist.length) || state.portsWhitelist.find(n=>n==vdp.name))
}

const sortByName = (a, b) => {
	if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
	if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
	return 0;	
}