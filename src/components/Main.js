require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';

class AppComponent extends React.Component {
	constructor(props) {
		super(props);
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

	render() {		
		const state = this.state
		const partitionDiagrams = [].concat(this.state.partitions).filter(p=>isRtePartition(p, state)).map((partition, dx)=>{
			return <PartitionDiagram partition={partition}  key={dx}  index={dx} state={state}/>;
		});
		return (
			<div className = "fbx partitions">{partitionDiagrams}</div>
			);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;




const PartitionDiagram = (props, key) => {
	const { partition, index, state } = props
	return 	<div className={"item partition "} key={key}>
				{partition.name}
				<div className="fbx clusters">						
					{(partition.clusters || []).filter(c=>isRteCluster(c, state)).sort(sortByName).map((cluster, dx)=>{
						return <ClusterDiagram cluster={cluster} key={dx} state={state}  />})}
				</div>				
			</div>
}

const ClusterDiagram = (props, key) => {
	const { cluster, state } = props
	let Diagrams = (cluster.components || []).sort(sortByName).filter(c=>isRteComponent(c, state)).map((component, dx)=>{
		return <ComponentDiagram component={component} key={dx}  state={state} />})
	return <div className="item cluster" key={key}>						
				{cluster.name}
				<div className="fbx components">
					{Diagrams}
				</div>	
			</div>
}

const ComponentDiagram = (props, key) => {
	const { component, state } = props
	return <div className="item component">					
				{component.name}
				<div className="fbx ports">
					{(component.ports || []).sort(sortByName).filter(p=>isRtePort(p, state)).map((port, dx)=>{
						return <PortDiagram port={port} key={dx} index={dx} state={state} />
					})}
				</div>			
			</div>
}

const PortDiagram = (props, key) => {
	const { port, state, index } = props	
	if (state.portsWhitelist && state.portsWhitelist.length && !state.portsWhitelist.find(n=>n==port.name)) {
		return null
	}
	const vdps = port.vdps.sort(sortByName).filter(v=>isRteVdp(v, state)).map((vdp, dx)=><Vdp vdp={vdp} key={dx} state={state} index={dx} />)
	return <div className="item port">
		<div className="tooltip" key={key} >{'p'+(index+1)}<span className="tooltiptext">{port.name}</span></div> 
		<br/>
		<div className="fbx vdps">
			{vdps}
		</div>
	</div>
}

const Vdp = (props, key) => {
	const { vdp, state, index } = props	
	const Desc = [vdp.name].concat(vdp.rPorts.map(rp=>rp.requiringComponent)).map((x, dx)=><div key={dx}>{x}</div>)
	return <div className="item vdp tooltip" key={key} >{'vdp'+(index+1)}<span className="tooltiptext">{Desc}</span></div>
}

const isRtePartition = (p, state) => {
	return  p && p.clusters && p.clusters.length && p.clusters.find(c=>isRteCluster(c, state))
} 

const isRteCluster = (c, state) => {
	return  c && c.components && c.components.length && c.components.find(c=>isRteComponent(c, state))
} 

const isRteComponent = (c, state) => {	
	return  c && c.ports && c.ports.length && c.ports.find(p=>isRtePort(p, state))
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