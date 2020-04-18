require('normalize.css/normalize.css');
require('styles/App.scss');


import React, { Component } from 'react';
import _ from 'lodash'
import funcs from '../Functions'
import PartitionsView from './PartitionsView'
import ConnectionsView from './ConnectionsView'

class AppComponent extends Component {
	constructor(props) {
		super(props);
		this.connectVdpsToComps = this.connectVdpsToComps.bind(this)
		this.selectVdp = this.selectVdp.bind(this)
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
				const state = { "partitions": data.partitions.sort(funcs.sortByName), "portsWhitelist": data.portsWhitelist }
				this.setState({ "partitions": state.partitions, "portsWhitelist": state.portsWhitelist })
				this.connectVdpsToComps(state)
			})
	}

	connectVdpsToComps(state) {
		const allComponents = _.flattenDepth(state.partitions.map(x => x.clusters.map(x => x.components)), 2)
		const allVdps = _.flattenDepth(allComponents.map(c => c.ports.map(p => p.vdps)), 2)
		allVdps.filter(vdp => funcs.isRteVdp(vdp, state)).forEach((vdp, dx) => {
			connect(vdp, state)
		})

		this.setState({ state })
	}

	selectVdp(e) {		
		e.selected = (e.selected ? false : true)
		this.setState({ refresh: true })
	}

	render() {
		const state = this.state
		const partitions = this.state.partitions.filter(p => funcs.isRtePartition(p, state))
		const partitionsView = <PartitionsView partitions={partitions} state={state}
			sf={{
				selectVdp: this.selectVdp
			}} />
		return (
			<div className={"fbx"}>
				<div className="item" style={_.extend({}, funcs.width(30))}>
					<div className={"fbx drcol"}>
						<div className="item">
							spotview
						</div>
						<div className="item" >
							{partitionsView}
						</div>
					</div>
				</div>
				<div className="item" style={_.extend({}, funcs.width(65))}>
					<ConnectionsView partitions={partitions} state={state}  />
				</div>
			</div>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;

const connect = (vdp, state) => {
	vdp.toComps = []
	const rPorts = vdp.rPorts
	const reqComps = rPorts.map(x => x.requiringComponent)	
	reqComps.forEach((rc, dx) => {
		const xs = rc.split("/")
		const partitionIndex = state.partitions.findIndex(p => p.name == xs[0])
		const clusterIndex = state.partitions[partitionIndex].clusters.findIndex(c => c.name == xs[1])
		const component = state.partitions[partitionIndex].clusters[clusterIndex].components.find(c => c.name == xs[2])
		component.connected = (component.connected == "connected" ? "" : "connected")
		vdp.toComps.push({ component })
	});
}


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
// const allComponents = _.flattenDepth(state.partitions.map(x => (x.clusters || []).map(x => x.components)), 2)
// const allVdps = _.flattenDepth(allComponents.map(c => c.ports.map(p => p.vdps)), 2)
// const connectionDiagrams = allVdps.filter(vdp => vdp.refs && funcs.isRteVdp(vdp, state)).map((vdp, dx) => {
// 	const p1 = vdp.refs["vdp_" + vdp.name]
// 	return vdp.toComps.filter(c => c.component.refs).map((tc, dx) => {
// 		const comp = tc.component
// 		const p2 = comp.refs["comp_" + comp.name]
// 		const p1Rect = p1.getBoundingClientRect()
// 		const p2Rect = p2.getBoundingClientRect()
// 		const x1 = p1Rect.left + (p1Rect.width / 2);
// 		const y1 = p1Rect.top + (p1Rect.height / 2);
// 		const x2 = p2Rect.left + (p2Rect.width / 2);
// 		const y2 = p2Rect.top + (p2Rect.height / 2);
// 		return <line x1={x1 - 30} y1={y1 - 15} x2={x2 - 30} y2={y2 - 40} style={lineStyle} />
// 	})
// })
{/* <svg style={svgStyle}>{connectionDiagrams}</svg> */ }