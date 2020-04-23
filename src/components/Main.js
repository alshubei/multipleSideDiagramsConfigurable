require('normalize.css/normalize.css');
require('styles/App.scss');


import React, { Component } from 'react';
import _ from 'lodash'
import funcs from '../Functions'
import PartitionsView from './PartitionsView'
import MultiSelectReact from 'multi-select-react';


class AppComponent extends Component {
	constructor(props) {
		super(props);
		this.connectVdpsToComps = this.connectVdpsToComps.bind(this)
		this.selectVdp = this.selectVdp.bind(this)
		this.selectPort = this.selectPort.bind(this)
		this.selectComponent = this.selectComponent.bind(this)
		this.handleConnectedCheck = this.handleConnectedCheck.bind(this)
		this.handleWhitelistCheck = this.handleWhitelistCheck.bind(this)
		this.handleShowNamesCheck = this.handleShowNamesCheck.bind(this)
		this.state = {
			multiSelect: [{name: "adsad", id:1, label: "asdsaadsa"}],
			filters: [
				{ type: 'onlyConnected', value: true },
				{ type: 'whitelist', value: true },
				{ type: 'showName', value: false },
			],
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
		fetch("../dataSmall.json")
		//fetch("../dataLarge.json")
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
		allVdps/*.filter(vdp => funcs.isRteVdp(vdp, state))*/.forEach((vdp, dx) => {
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
	handleWhitelistCheck(b) {
		const newFilters = this.state.filters || []
		const filter = newFilters.find(f => f.type == 'whitelist')
		if (!filter) {
			newFilters.push({ type: 'whitelist', value: b })
		} else {
			filter.value = b
		}
		this.setState({ filters: newFilters })
	}
	handleShowNamesCheck(b) {
		const newFilters = this.state.filters || []
		const filter = newFilters.find(f => f.type == 'showName')
		if (!filter) {
			newFilters.push({ type: 'showName', value: b })
		} else {
			filter.value = b
		}
		this.setState({ filters: newFilters })
	}

	handleConnectedCheck(b) {
		const newFilters = this.state.filters || []
		const filter = newFilters.find(f => f.type == 'onlyConnected')
		if (!filter) {
			newFilters.push({ type: 'onlyConnected', value: b })
		} else {
			filter.value = b
		}
		this.setState({ filters: newFilters })
	}
	onSelect(selectedList, selectedItem) {

	}

	onRemove(selectedList, removedItem) {

	}

	optionClicked(optionsList) {
		this.setState({ multiSelect: optionsList });
	}
	selectedBadgeClicked(optionsList) {
		this.setState({ multiSelect: optionsList });
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
		const selectedOptionsStyles = {
			color: "#3c763d",
			backgroundColor: "#dff0d8"
		};
		const optionsListStyles = {
			backgroundColor: "#dff0d8",
			color: "#3c763d"
		};
		return (
			<div className={"fbx"}>
				<div className="br filters" style={_.extend({}, funcs.width(10))}>
					<ul className="options">
						<li>ports/vdps:</li>
						<li><Checkbox label="connected" handle={(s) => this.handleConnectedCheck(s)} /></li>
						<li><Checkbox label="in portswhitelist" handle={(s) => this.handleWhitelistCheck(s)} /></li>
					</ul>
					<ul className="portswhitelist">
						<MultiSelectReact
							options={this.state.multiSelect}
							optionClicked={this.optionClicked.bind(this)}
							selectedBadgeClicked={this.selectedBadgeClicked.bind(this)}
							selectedOptionsStyles={selectedOptionsStyles}
							optionsListStyles={optionsListStyles}
						/>
						<li>portsWhitelist</li>
						{(state.portsWhitelist || []).map((p, dx) => {
							return <li key={dx}>{p.trim()}</li>
						})}</ul>
				</div>
				<div className={"fbx drcol"} style={_.extend({}, funcs.width(88))}>
					<div className="br controls">
						<Checkbox label="show names: " checked={false} handle={(s) => this.handleShowNamesCheck(s)} />
					</div>
					<div className="br partitionsView" >
						{partitionsView}
					</div>
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

class Checkbox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isChecked: (props.checked !== undefined ? props.checked : true),
		};
	}
	toggleChange = () => {
		this.setState({
			isChecked: !this.state.isChecked,
		});
		if (this.props.handle)
			this.props.handle(!this.state.isChecked)
	}
	render() {
		return (
			<label>
				{this.props.label}
				<input type="checkbox"
					checked={this.state.isChecked}
					onChange={this.toggleChange}
				/>
			</label>
		);
	}
}