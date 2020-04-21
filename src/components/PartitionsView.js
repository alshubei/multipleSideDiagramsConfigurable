require('normalize.css/normalize.css');
require('styles/App.scss');


import React, { Component } from 'react';
import _ from 'lodash'
import funcs from '../Functions'

class PartitionsView extends Component {
    render() {
        const { partitions, sf, state } = this.props
        const partitionDiagrams = partitions.map((partition, dx) => {
            return <PartitionDiagram partition={partition} key={dx} parIndex={dx} sf={sf} state={state} />;
        });
        return <div className={"fbx partitions"}>
            {partitionDiagrams}
        </div>
    }
}

class PartitionDiagram extends Component {

    render() {
        const { partition, parIndex, state, sf } = this.props
        return <div className={"br partition "} key={parIndex}>
            <span className="name">{partition.name}</span>
            <div className={"fbx clusters"}>
                {(partition.clusters || []).filter(c => funcs.isRteCluster(c, state)).sort(funcs.sortByName).map((cluster, dx) => {
                    return <ClusterDiagram cluster={cluster} key={dx} clIndex={dx} parIndex={parIndex} sf={sf} state={state} />
                })}
            </div>
        </div>
    }
}

PartitionsView.defaultProps = {};

export default PartitionsView;

class ClusterDiagram extends Component {
    render() {
        const { cluster, clIndex, parIndex, state, sf } = this.props
        let Diagrams = (cluster.components || []).sort(funcs.sortByName).filter(c => funcs.isRteComponent(c, state)).map((component, dx) => {
            return <ComponentDiagram component={component} key={dx} compIndex={dx} clIndex={clIndex} parIndex={parIndex} sf={sf} state={state} />
        })
        return <div className="br cluster" key={clIndex}>
            <span className="name">{(cluster.name)}</span>
            <div className="fbx components">
                {Diagrams}
            </div>
        </div>
    }
}

class ComponentDiagram extends Component {

    render() {
        const { component, compIndex, parIndex, clIndex, sf, state } = this.props
        const selComp = (e, conType) => {
            e.preventDefault(); e.stopPropagation();
            sf.selectComponent(parIndex, clIndex, compIndex, conType)
        }
        const outComps = _.flattenDepth(component.ports.map(p => p.vdps), 2)        
        const inVdps = (component.inVdps || [])
        const connected = outComps.length || inVdps.length
        component.inVdps = component.inVdps || []
        return <div className={"br component " + (connected ? "connected" : "")} key={compIndex} >
            <span className="name">{(component.name)}</span>
            <span onClick={(e) => selComp(e, 'in')} className="con-in">{inVdps.length}↙</span>
            <span onClick={(e) => selComp(e, 'out')} className="con-out">{outComps.length}↗</span>
            <div className="fbx ports">
                {(component.ports || []).sort(funcs.sortByName).filter(p => funcs.isRtePort(p, state)).map((port, dx) => {
                    return <PortDiagram port={port} key={dx} portIndex={dx} clIndex={clIndex} parIndex={parIndex} compIndex={compIndex} sf={sf} state={state} />
                })}
            </div>
        </div>
    }
}

class PortDiagram extends Component {
    render() {
        const { port, portIndex, parIndex, clIndex, compIndex, sf, state } = this.props
        const selPort = (e) => {
            e.preventDefault(); e.stopPropagation(); sf.selectPort(parIndex, clIndex, compIndex, portIndex)
        }
        // if (state.portsWhitelist && state.portsWhitelist.length && !state.portsWhitelist.find(n => n.trim() == port.name)) {
        //     return null
        // }
        const vdps = port.vdps.sort(funcs.sortByName).filter(v => funcs.isRteVdp(v, state)).map(
            (vdp, dx) => <Vdp vdp={vdp} key={dx} state={state} vdpIndex={dx} parIndex={parIndex} clIndex={clIndex} compIndex={compIndex} portIndex={portIndex} sf={sf} />)
        return <div className="br port" key={portIndex} onClick={(e) => { selPort(e) }}>
            <div className="name tooltip">{('p' + (portIndex + 1))}<span className="tooltiptext">{port.name}</span></div>
            <br />
            <div className="fbx vdps">
                {vdps}
            </div>
        </div>
    }
}

class Vdp extends Component {
    render() {
        const { vdp, state, vdpIndex, portIndex, parIndex, clIndex, compIndex, sf } = this.props
        const selVdp = (e) => {
            e.preventDefault(); e.stopPropagation(); sf.selectVdp(parIndex, clIndex, compIndex, portIndex, vdpIndex)
        }
        const Desc = (vdp.rPorts && vdp.rPorts.length) ? [].concat(vdp.rPorts.map(rp => rp.requiringComponent)).sort().map((x, dx) => <div key={dx}>{x}</div>) : <div key={vdpIndex}>no_reqs</div>
        return <div className={"br vdp tooltip " + (funcs.isVdpRequired(vdp) ? "connected" : "")} key={vdpIndex}
            onClick={(e) => { selVdp(e) }}>
            <span className="name">{('vdp' + (vdpIndex + 1))}<span className="tooltiptext">{vdp.name}{': '}{Desc}</span></span>
        </div>
    }
}
