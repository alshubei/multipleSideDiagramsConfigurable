require('normalize.css/normalize.css');
require('styles/App.scss');


import React, { Component } from 'react';
import _ from 'lodash'
import funcs from '../Functions'

class PartitionsView extends Component {
    render() {
        const { partitions, sf, state} = this.props        
        const partitionDiagrams = partitions.map((partition, dx) => {
            return <PartitionDiagram partition={partition} key={dx} index={dx} sf={sf}  state={state} />;
        });
        return <div className={"fbx partitions"}>
            {partitionDiagrams}
        </div>
    }
}

class PartitionDiagram extends Component {
    
    render() {
        const { partition, index, state, sf } = this.props
        return <div className={"item partition "} key={index}>
            <span className="name">{partition.name}</span>
            <div className={"fbx clusters"}>
                {(partition.clusters || []).filter(c => funcs.isRteCluster(c, state)).sort(funcs.sortByName).map((cluster, dx) => {                    
                    return <ClusterDiagram cluster={cluster} key={dx} index={dx} sf={sf} state={state}  />
                })}
            </div>
        </div>
    }
}

PartitionsView.defaultProps = {};

export default PartitionsView;

class ClusterDiagram extends Component {
	render() {
		const { cluster, index, state, sf } = this.props
		let Diagrams = (cluster.components || []).sort(funcs.sortByName).filter(c => funcs.isRteComponent(c, state)).map((component, dx) => {
			return <ComponentDiagram component={component} key={dx} index={dx} sf={sf}  state={state}  />
		})
		return <div className="item cluster" key={index}>
			<span className="name">{(cluster.name)}</span>
			<div className="fbx components">
				{Diagrams}
			</div>
		</div>
	}
}

class ComponentDiagram extends Component {
	
	render() {
		const { component, index, sf, state} = this.props
		return <div className={"item component " + (component.connected ? "connected" : "")} key={index}>
			<span className="name">{(component.name)}</span>
			<div className="fbx ports">
				{(component.ports || []).sort(funcs.sortByName).filter(p => funcs.isRtePort(p, state)).map((port, dx) => {
					return <PortDiagram port={port} key={dx} index={dx} sf={sf} state={state}  />
				})}
			</div>
		</div>
	}
}

class PortDiagram extends Component {
	render() {
		const { port, index, sf, state } = this.props
		if (state.portsWhitelist && state.portsWhitelist.length && !state.portsWhitelist.find(n => n.trim() == port.name)) {
			return null
		}
		const vdps = port.vdps.sort(funcs.sortByName).filter(v => funcs.isRteVdp(v, state)).map(
			(vdp, dx) => <Vdp vdp={vdp} key={dx} state={state} index={dx} sf={sf}  />)
		return <div className="item port" key={index}>
			<div className="name tooltip">{('p' + (index + 1))}<span className="tooltiptext">{port.name}</span></div>
			<br />
			<div className="fbx vdps">
				{vdps}
			</div>
		</div>
	}
}

class Vdp extends Component {
	
	render() {
		const { vdp, state, index, sf } = this.props
		const Desc = (vdp.rPorts && vdp.rPorts.length) ? [].concat(vdp.rPorts.map(rp => rp.requiringComponent)).sort().map((x, dx) => <div key={dx}>{x}</div>) : <div key={index}>no_reqs</div>
		return <div className={"item vdp tooltip " + (funcs.isVdpRequired(vdp) ? "connected" : "")} key={index} 
        onClick={()=>sf.selectVdp(vdp)}>
			<span className="name">{('vdp' + (index + 1))}<span className="tooltiptext">{vdp.name}{': '}{Desc}</span></span>
		</div>
	}
}
