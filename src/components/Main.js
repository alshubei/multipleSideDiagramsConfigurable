require('normalize.css/normalize.css');
require('styles/App.css');


import React from 'react';

//const data = '{"partitions":[{"name": "ebsP"},{"clusters":[{"components":[{"prototypePath":"","asil":"d","cIDLApplication":"ebs","core":"0","cycleTime":"1000","plugins":[],"dataTypes":[],"ports":[],"name":"AReqComp2"},{"prototypePath":"","asil":"b","cIDLApplication":"ebs","core":"0","cycleTime":"5000","plugins":[],"dataTypes":[],"ports":[],"name":"reqComp1"},{"prototypePath":"","asil":"qm","cIDLApplication":"ebs","core":"","cycleTime":"cNO_CYCLE_TIME","plugins":[],"dataTypes":[],"ports":[],"name":"EbsCore_BaseTypes"},{"prototypePath":"","asil":"qm","cIDLApplication":"ebs","core":"0","cycleTime":"cNO_CYCLE_TIME","plugins":[],"dataTypes":[{"category":"BaseType:VALUE","name":"sint8"}],"ports":[{"type":"PPORT","asil":"qm","priority":"T10MS_PRIO1","interfacePath":"/cluster1/composite1/Interfaces/port3","portPrototypePath":"","updateTime":"10000","vdps":[{"dataTypePath":"partition1/cluster1/composite1/sint8","swAddrMethodPath":"/AUTOSAR/DataDefinitions/AddressingMethods/EBS/QM_T10MS_PRIO1","updateTime":"10000","rPorts":[{"requiringComponent":"partition1/cluster1/reqComp1","transferTime":"10000","rteTaskName":"RteCore0Task10msSync10msOut","taskPosition":"301","osTaskPath":"/AUTOSAR/Os/RteCore0Task10msSync10msOut","osApplicationPath":"","name":"port3"}],"name":"port3"}],"transferTime":"10000","rteTaskName":"RteCore0Task10msSync10msOut","taskPosition":"300","osTaskPath":"/AUTOSAR/Os/RteCore0Task10msSync10msOut","osApplicationPath":"","name":"port3"},{"type":"PPORT","asil":"d","priority":"T10MS_PRIO1","interfacePath":"/cluster1/composite1/Interfaces/port2","portPrototypePath":"","updateTime":"10000","vdps":[{"updateTime":"10000","rPorts":[{"requiringComponent":"partition1/cluster1/comp2","transferTime":"10000","rteTaskName":"RteCore0Task10msSafetySync10msOut","taskPosition":"301","osTaskPath":"/AUTOSAR/Os/RteCore0Task10msSafetySync10msOut","osApplicationPath":"","name":"port2"}],"name":"port2"}],"transferTime":"10000","rteTaskName":"RteCore0Task10msSafetySync10msOut","taskPosition":"300","osTaskPath":"/AUTOSAR/Os/RteCore0Task10msSafetySync10msOut","osApplicationPath":"","name":"port2"}],"name":"composite1"},{"prototypePath":"","asil":"qm","cIDLApplication":"ebs","core":"2","cycleTime":"5000","plugins":[],"dataTypes":[{"category":"BaseType:VALUE","name":"sint8"},{"category":"StructType:STRUCTURE","name":"bus_act_val_req_t"},{"category":"BaseType:VALUE","name":"uint16"}],"ports":[{"type":"PPORT","asil":"qm","priority":"T10MS_PRIO2","interfacePath":"/cluster1/ProviderComp/Interfaces/ARHpmOrificeFactor","portPrototypePath":"","updateTime":"5000","vdps":[{"dataTypePath":"partition1/cluster1/ProviderComp/sint8","swAddrMethodPath":"/AUTOSAR/DataDefinitions/AddressingMethods/EBS/QM_T10MS_PRIO2","updateTime":"5000","rPorts":[{"requiringComponent":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct","portPrototypePath":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct/ARHpmOrificeFactor","transferTime":"5000","rteTaskName":"RteCore2Task5msSync5msOut","taskPosition":"104","osTaskPath":"RteCore2Task5msSync5msOut","osApplicationPath":"","name":"ARHpmOrificeFactor"}],"name":"ARHpmOrificeFactor"}],"transferTime":"5000","rteTaskName":"RteCore2Task5msSync5msOut","taskPosition":"101","osTaskPath":"RteCore2Task5msSync5msOut","osApplicationPath":"","name":"ARHpmOrificeFactor"},{"type":"PPORT","asil":"qm","priority":"T10MS_PRIO2","interfacePath":"/cluster1/ProviderComp/Interfaces/ARSysPrsSigCalibFiltFast","portPrototypePath":"","updateTime":"5000","vdps":[{"dataTypePath":"partition1/cluster1/ProviderComp/bus_act_val_req_t","swAddrMethodPath":"/AUTOSAR/DataDefinitions/AddressingMethods/EBS/QM_T10MS_PRIO2","updateTime":"5000","rPorts":[{"requiringComponent":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct","portPrototypePath":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct/ARSysPrsSigCalibFiltFast","transferTime":"5000","rteTaskName":"RteCore2Task5msSync5msOut","taskPosition":"105","osTaskPath":"RteCore2Task5msSync5msOut","osApplicationPath":"","name":"ARSysPrsSigCalibFiltFast"}],"name":"ARSysPrsSigCalibFiltFast"}],"transferTime":"5000","rteTaskName":"RteCore2Task5msSync5msOut","taskPosition":"102","osTaskPath":"RteCore2Task5msSync5msOut","osApplicationPath":"","name":"ARSysPrsSigCalibFiltFast"},{"type":"PPORT","asil":"qm","priority":"T10MS_PRIO2","interfacePath":"/cluster1/ProviderComp/Interfaces/ARDbrArbPressureRequest","portPrototypePath":"","updateTime":"5000","vdps":[{"dataTypePath":"partition1/cluster1/ProviderComp/uint16","swAddrMethodPath":"/AUTOSAR/DataDefinitions/AddressingMethods/EBS/QM_T10MS_PRIO2","updateTime":"5000","rPorts":[{"requiringComponent":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct","portPrototypePath":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct/ARDbrArbPressureRequest","transferTime":"5000","rteTaskName":"RteCore2Task5msSync5msOut","taskPosition":"103","osTaskPath":"RteCore2Task5msSync5msOut","osApplicationPath":"","name":"ARDbrArbPressureRequest"}],"name":"ARDbrArbPressureRequest"}],"transferTime":"5000","rteTaskName":"RteCore2Task5msSync5msOut","taskPosition":"100","osTaskPath":"RteCore2Task5msSync5msOut","osApplicationPath":"","name":"ARDbrArbPressureRequest"}],"name":"ProviderComp"},{"prototypePath":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct","asil":"d","cIDLApplication":"ebs","core":"0","cycleTime":"2500","plugins":[],"dataTypes":[],"ports":[],"name":"MKC2HydAct"},{"prototypePath":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct","asil":"d","cIDLApplication":"ebs","core":"0","cycleTime":"2500","plugins":[],"dataTypes":[{"category":"NumericType:VALUE","name":"enum_hyd_mode_t"},{"category":"StructType:STRUCTURE","name":"bus_motor_req_t"},{"category":"NumericType:VALUE","name":"enum_modulator_req_t"},{"category":"StructType:STRUCTURE","name":"bus_act_val_req_t"}],"ports":[{"type":"PPORT","asil":"d","priority":"","interfacePath":"/HydAct/MKC2HydAct/MKC2HydAct_if/ActiveHydMode","portPrototypePath":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct/ActiveHydMode","updateTime":"2500","vdps":[{"dataTypePath":"partition1/cluster1/MKC2HydAct_ARXML/enum_hyd_mode_t","swAddrMethodPath":"","updateTime":"2500","rPorts":[{"requiringComponent":"partition1/cluster1/reqComp1","transferTime":"2500","rteTaskName":"RteTaskMKC2HydAct","osTaskPath":"RteTaskMKC2HydAct","osApplicationPath":"","name":"ActiveHydMode_ActiveHydMode"}],"name":"ActiveHydMode_ActiveHydMode"}],"transferTime":"2500","rteTaskName":"RteCore0Task2500usSafetySync2500usOut","osTaskPath":"RteCore0Task2500usSafetySync2500usOut","osApplicationPath":"","name":"ActiveHydMode_ActiveHydMode"},{"type":"PPORT","asil":"d","priority":"","interfacePath":"/HydAct/MKC2HydAct/MKC2HydAct_if/HydActMotorReq","portPrototypePath":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct/ARHydActMotorReq","updateTime":"2500","vdps":[{"dataTypePath":"partition1/cluster1/MKC2HydAct_ARXML/bus_motor_req_t","swAddrMethodPath":"","updateTime":"2500","rPorts":[],"name":"ARHydActMotorReq_HydActMotorReq"}],"transferTime":"2500","rteTaskName":"RteCore0Task2500usSafetySync2500usOut","osTaskPath":"RteCore0Task2500usSafetySync2500usOut","osApplicationPath":"","name":"ARHydActMotorReq_HydActMotorReq"},{"type":"PPORT","asil":"d","priority":"","interfacePath":"/HydAct/MKC2HydAct/MKC2HydAct_if/HydActModulatorReq","portPrototypePath":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct/ARHydActModulatorReq","updateTime":"2500","vdps":[{"dataTypePath":"partition1/cluster1/MKC2HydAct_ARXML/enum_modulator_req_t","swAddrMethodPath":"","updateTime":"2500","rPorts":[],"name":"ARHydActModulatorReq_HydActModulatorReq"}],"transferTime":"2500","rteTaskName":"RteCore0Task2500usSafetySync2500usOut","osTaskPath":"RteCore0Task2500usSafetySync2500usOut","osApplicationPath":"","name":"ARHydActModulatorReq_HydActModulatorReq"},{"type":"PPORT","asil":"d","priority":"","interfacePath":"/HydAct/MKC2HydAct/MKC2HydAct_if/HydActValveReq","portPrototypePath":"/HydAct/MKC2HydAct/MKC2HydAct_swc/MKC2HydAct/ARHydActValveReq","updateTime":"2500","vdps":[{"dataTypePath":"partition1/cluster1/MKC2HydAct_ARXML/bus_act_val_req_t","swAddrMethodPath":"","updateTime":"2500","rPorts":[],"name":"ARHydActValveReq_HydActValveReq"}],"transferTime":"2500","rteTaskName":"RteCore0Task2500usSafetySync2500usOut","osTaskPath":"RteCore0Task2500usSafetySync2500usOut","osApplicationPath":"","name":"ARHydActValveReq_HydActValveReq"}],"name":"MKC2HydAct_ARXML"},{"prototypePath":"","asil":"c","cIDLApplication":"ebs","core":"0","cycleTime":"5000","plugins":[],"dataTypes":[{"category":"BaseType:VALUE","name":"sint8"}],"ports":[{"type":"PPORT","asil":"c","priority":"T10MS_PRIO1","interfacePath":"/cluster1/comp2/Interfaces/port4","portPrototypePath":"","updateTime":"5000","vdps":[{"dataTypePath":"partition1/cluster1/comp2/sint8","swAddrMethodPath":"/AUTOSAR/DataDefinitions/AddressingMethods/EBS/T10MS_PRIO1","updateTime":"5000","rPorts":[{"requiringComponent":"partition1/cluster1/composite1","transferTime":"5000","rteTaskName":"RteCore0Task5msSafetySync5msOut","taskPosition":"201","osTaskPath":"/AUTOSAR/Os/RteCore0Task5msSafetySync5msOut","osApplicationPath":"","name":"port4"},{"requiringComponent":"partition1/cluster1/AReqComp2","transferTime":"5000","rteTaskName":"RteCore0Task5msSafetySync5msOut","taskPosition":"202","osTaskPath":"/AUTOSAR/Os/RteCore0Task5msSafetySync5msOut","osApplicationPath":"","name":"port4"}],"name":"port4"}],"transferTime":"5000","rteTaskName":"RteCore0Task5msSafetySync5msOut","taskPosition":"200","osTaskPath":"/AUTOSAR/Os/RteCore0Task5msSafetySync5msOut","osApplicationPath":"","name":"port4"}],"name":"comp2"}],"name":"cluster1"}],"name":"partition1"}],"name":"EBS"}'

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
		.then((data) => this.setState({ "partitions": data.partitions , "portsWhitelist": data.portsWhitelist}))
    }

	render() {		
		const state = this.state
		const partitionDiagrams = this.state.partitions.filter(p=>isRtePartition(p, state)).map((partition, dx)=>{
			return <PartitionDiagram partition={partition}  key={dx}  state={state}/>;
		});

		return (
			<div className = "fbx partitions">{partitionDiagrams}</div>
			);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;




const PartitionDiagram = (props, key) => {
	const { partition, state } = props
	return 	<div className="item partition" key={key}>
				{partition.name}
				<div className="fbx clusters">						
					{(partition.clusters || []).filter(c=>isRteCluster(c, state)).map((cluster, dx)=>{
						return <ClusterDiagram cluster={cluster} key={dx} state={state}  />})}
				</div>				
			</div>
}

const ClusterDiagram = (props, key) => {
	const { cluster, state } = props
	let Diagrams = (cluster.components || []).filter(c=>isRteComponent(c, state)).map((component, dx)=>{
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
					{(component.ports || []).filter(p=>isRtePort(p, state)).map((port, dx)=>{
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
	const vdps = port.vdps.filter(v=>isRteVdp(v, state)).map((vdp, dx)=><Vdp vdp={vdp} key={dx} state={state} index={dx} />)
	return <div className="item port">
		<div className="tooltip" key={key} >{'p'+(index+1)}<span className="tooltiptext">{port.name}</span></div> 
		{vdps}
	</div>
}

const Vdp = (props, key) => {
	const { vdp, state, index } = props	
	return <div className="item vdp tooltip" key={key} >{'vdp'+(index+1)}<span className="tooltiptext">{vdp.name}</span></div>
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