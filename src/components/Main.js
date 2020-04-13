require('normalize.css/normalize.css');
require('styles/App.scss');


import React, { Component } from 'react';
import _ from 'lodash'

class AppComponent extends Component {
	constructor(props) {
		super(props);
		this.connectVdpToComps = this.connectVdpToComps.bind(this)
		this.connectVdpsToComps = this.connectVdpsToComps.bind(this)
		this.state = {
			partitions: [
				{
					name: "<PARTITION-NAME>", clusters: [
						{
							name: "<CLUSTER-NAME>", components: [
								{
									name: "<COMPONENT-NAME>", ports: [
										{ name: "<PORT-NAME>", vdps: [{ name: "<VDP-NAME>", rPorts: [] }] }]
								}]
						}]
				}]
		}
	}

	componentDidMount() {
		//fetch("../dataSmall.json")				
		fetch("../dataLarge.json")
			.then((response) => response.json())
			.then((data) => {
				const state = { "partitions": data.partitions.sort(sortByName), "portsWhitelist": data.portsWhitelist }
				this.setState({ "partitions": state.partitions, "portsWhitelist": state.portsWhitelist })
				this.connectVdpsToComps(state)
			})
	}

	connectVdpsToComps(state) {
		const allComponents = _.flattenDepth(state.partitions.map(x => x.clusters.map(x => x.components)), 2)
		const allVdps = _.flattenDepth(allComponents.map(c => c.ports.map(p => p.vdps)), 2)
		allVdps.filter(vdp => isRteVdp(vdp, state)).forEach((vdp, dx) => {
			connect(vdp, state)
		})

		this.setState({ state })
	}

	connectVdpToComps(vdp) {
		vdp.toComps = []
		const state = this.state
		const allComponents = _.flattenDepth(state.partitions.map(x => x.clusters.map(x => x.components)), 2)
		const allVdps = _.flattenDepth(allComponents.map(c => c.ports.map(p => p.vdps)), 2)

		connect(vdp, state)

	}

	render() {
		const state = this.state
		const partitionDiagrams = [].concat(this.state.partitions).filter(p => isRtePartition(p, state)).map((partition, dx) => {
			return <PartitionDiagram partition={partition} key={dx} index={dx} state={state} funcs={{ "connectVdpToComps": this.connectVdpToComps }} />;
		});

		const lineStyle = {
			"strokeWidth": "2px",
			"stroke": "red",
		}
		const svgStyle = {
			"height": "100%", 
			"width": "100%",
			"border": "1px solid",			
			"position": "absolute"
		}
		const allComponents = _.flattenDepth(state.partitions.map(x => (x.clusters || []).map(x => x.components)), 2)
		const allVdps = _.flattenDepth(allComponents.map(c => c.ports.map(p => p.vdps)), 2)
		const connectionDiagrams = allVdps.filter(vdp => vdp.refs && isRteVdp(vdp, state)).map((vdp, dx) => {
			const p1 = vdp.refs["vdp_" + vdp.name]
			return vdp.toComps.filter(c => c.component.refs).map((tc, dx) => {
				const comp = tc.component
				const p2 = comp.refs["comp_" + comp.name]
				const p1Rect = p1.getBoundingClientRect()
				const p2Rect = p2.getBoundingClientRect()
				const x1 = p1Rect.left + (p1Rect.width / 2);
				const y1 = p1Rect.top + (p1Rect.height / 2);
				const x2 = p2Rect.left + (p2Rect.width / 2);
				const y2 = p2Rect.top + (p2Rect.height / 2);
				return <line x1={x1 - 30} y1={y1 - 15} x2={x2 - 30} y2={y2 - 40} style={lineStyle} />
			})
		})
		return (
			<div className="fbx partitions">
				{partitionDiagrams}
				<svg style={svgStyle}>{connectionDiagrams}</svg>
			</div>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;




class PartitionDiagram extends Component {
	render() {
		const { partition, index, funcs, state } = this.props
		return <div className={"item partition "} key={index}>
			{partition.name}
			<div className="fbx clusters">
				{(partition.clusters || []).filter(c => isRteCluster(c, state)).sort(sortByName).map((cluster, dx) => {
					return <ClusterDiagram cluster={cluster} key={dx} state={state} partitionIndex={index} index={dx} funcs={funcs} />
				})}
			</div>
		</div>
	}
}

class ClusterDiagram extends Component {
	render() {
		const { cluster, index, partitionIndex, funcs, state } = this.props
		let Diagrams = (cluster.components || []).sort(sortByName).filter(c => isRteComponent(c, state)).map((component, dx) => {
			return <ComponentDiagram component={component} key={dx} state={state} index={dx} partitionIndex={partitionIndex} clusterIndex={index} funcs={funcs} />
		})
		return <div className="item cluster" key={index}>
			{cluster.name}
			<div className="fbx components">
				{Diagrams}
			</div>
		</div>
	}
}

class ComponentDiagram extends Component {
	constructor() {
		super();
		this.state = {

		}
	}
	componentDidMount() {
		this.setState({ refs: this.refs })
	}
	render() {
		const { component, index, partitionIndex, clusterIndex, funcs, state } = this.props
		component.refs = this.state.refs
		return <div ref={"comp_" + component.name} className={"item component " + (component.connected ? "connected" : "")} key={index}>
			{component.name}
			<div className="fbx ports">
				{(component.ports || []).sort(sortByName).filter(p => isRtePort(p, state)).map((port, dx) => {
					return <PortDiagram port={port} key={dx} index={dx} partitionIndex={partitionIndex} clusterIndex={clusterIndex} componentIndex={index} state={state} funcs={funcs} />
				})}
			</div>
		</div>
	}
}

class PortDiagram extends Component {
	render() {
		const { port, index, partitionIndex, clusterIndex, componentIndex, funcs, state } = this.props
		if (state.portsWhitelist && state.portsWhitelist.length && !state.portsWhitelist.find(n => n.trim() == port.name)) {
			return null
		}
		const vdps = port.vdps.sort(sortByName).filter(v => isRteVdp(v, state)).map(
			(vdp, dx) => <Vdp vdp={vdp} key={dx} state={state} index={dx} partitionIndex={partitionIndex} clusterIndex={clusterIndex} componentIndex={componentIndex} portIndex={index} funcs={funcs} />)
		return <div className="item port" key={index}>
			<div className="tooltip">{'p' + (index + 1)}<span className="tooltiptext">{port.name}</span></div>
			<br />
			<div className="fbx vdps">
				{vdps}
			</div>
		</div>
	}
}

class Vdp extends Component {
	constructor() {
		super();
		this.state = {}
	}
	componentDidMount() {
		this.setState({ refs: this.refs })
	}
	render() {
		const { vdp, state, index, partitionIndex, clusterIndex, componentIndex, portIndex, funcs } = this.props

		vdp.refs = this.state.refs
		const Desc = (vdp.rPorts && vdp.rPorts.length) ? [].concat(vdp.rPorts.map(rp => rp.requiringComponent)).sort().map((x, dx) => <div key={dx}>{x}</div>) : <div key={index}>no_reqs</div>
		return <div ref={"vdp_" + vdp.name} className={"item vdp tooltip " + (vdp.connected ? "connected" : "")} key={index} onClick={() => clickVdp(vdp, funcs, state)} >
			{'vdp' + (index + 1)}<span className="tooltiptext">{vdp.name}{': '}{Desc}</span>
		</div>
	}
}

const clickVdp = (vdp, funcs, state) => {
	funcs.connectVdpToComps(vdp)
}

const isRtePartition = (p, state) => {
	return p && p.clusters && p.clusters.length && p.clusters.find(c => isRteCluster(c, state))
}

const isRteCluster = (c, state) => {
	return c && c.components && c.components.length && c.components.find(c => isRteComponent(c, state))
}

const isRteComponent = (c, state) => {
	return c && c.ports && c.ports.length //&& c.ports.find(p=>isRtePort(p, state))
}

const isRtePort = (p, state) => {
	return p && ((!state.portsWhitelist || !state.portsWhitelist.length) || state.portsWhitelist.find(n => n.trim() == p.name))
}

const isRteVdp = (vdp, state) => {
	return vdp && ((!state.portsWhitelist || !state.portsWhitelist.length) || state.portsWhitelist.find(n => n.trim() == vdp.name))
}

const sortByName = (a, b) => {
	if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
	if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
	return 0;
}

const connect = (vdp, state) => {
	vdp.toComps = []
	vdp.connected = "connected"//(vdp.connected == "connected" ? "" : "connected")
	const rPorts = vdp.rPorts
	const reqComps = rPorts.map(x => x.requiringComponent)
	reqComps.forEach((rc, dx) => {
		const xs = rc.split("/")
		const partitionIndex = state.partitions.findIndex(p => p.name == xs[0])
		const clusterIndex = state.partitions[partitionIndex].clusters.findIndex(c => c.name == xs[1])
		const component = state.partitions[partitionIndex].clusters[clusterIndex].components.find(c => c.name == xs[2])
		component.connected = "connected"//(component.connected == "connected" ? "" : "connected")
		vdp.toComps.push({ component })
	});
}