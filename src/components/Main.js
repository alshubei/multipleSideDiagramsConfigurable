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
		this.selectPort = this.selectPort.bind(this)
		this.selectComponent = this.selectComponent.bind(this)
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

	selectVdp(parIndex, clIndex, compIndex, portIndex, vdpIndex) {
		this.setState({ selectedType: 'vdp', ... { parIndex, clIndex, compIndex, portIndex, vdpIndex } })
	}

	selectPort(parIndex, clIndex, compIndex, portIndex) {
		this.setState({ selectedType: 'port', ...{ parIndex, clIndex, compIndex, portIndex } })
	}

	selectComponent(parIndex, clIndex, compIndex, connectionType) {
		this.setState({ selectedType: 'component', ...{ parIndex, clIndex, compIndex, connectionType } })
	}

	render() {
		const state = this.state
		const partitions = this.state.partitions.filter(p => funcs.isRtePartition(p, state))
		const partitionsView = <PartitionsView partitions={partitions} state={state}
			sf={{
				selectVdp: this.selectVdp,
				selectPort: this.selectPort,
				selectComponent: this.selectComponent
			}} />
		return (
			<div className={"fbx"}>
				<div className="br" style={_.extend({}, funcs.width(40))}>
					<div className={"fbx drcol"}>
						<div className="br">
							spotview
						</div>
						<div className="br" >
							{partitionsView}
						</div>
					</div>
				</div>
				<div className="br" style={_.extend({}, funcs.width(50))}>
					<div className="br">
						spotview
					</div>
					<br />
					<ConnectionsView partitions={partitions} state={state} />
				</div>
			</div>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;

const connect = (vdp, state) => {
	vdp.outComps = []
	const rPorts = vdp.rPorts
	const reqComps = rPorts.map(x => x.requiringComponent)
	reqComps.forEach((rc, dx) => {
		const xs = rc.split("/")
		const partitionIndex = state.partitions.findIndex(p => p.name == xs[0])
		const clusterIndex = state.partitions[partitionIndex].clusters.findIndex(c => c.name == xs[1])
		const component = state.partitions[partitionIndex].clusters[clusterIndex].components.find(c => c.name == xs[2])
		component.inVdps = component.inVdps ? component.inVdps : []
		component.inVdps.push(vdp)// (component.connected == "connected" ? "" : "connected")
		vdp.outComps.push(component)
	});
}