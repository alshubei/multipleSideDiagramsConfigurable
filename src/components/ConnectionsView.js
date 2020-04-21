require('normalize.css/normalize.css');
require('styles/App.scss');


import React, { Component } from 'react';
import _ from 'lodash'
import funcs from '../Functions'
import PartitionsView from './PartitionsView';

class ConnectionsView extends Component {
    constructor() {
        super();
        this.state = {}
    }
    componentDidMount() {
    }

    createConnectionsForComp(par, cl, comp, conType, k) {
        const connections = []
        comp.ports.forEach((port, pDx) => {
            connections.push(this.createConnectionsForPort(par, cl, comp, port, k++))
        })
        return connections
    }

    createConnectionsForPort(par, cl, comp, port, k) {
        const connections = []
        port.vdps.forEach((vdp, vdpDx) => {
            connections.push(this.createConnectionsForVdp(par, cl, comp, port, vdp, k++))
        })
        return connections
    }
    createConnectionsForVdp(par, cl, comp, port, vdp, k) {
        let props = { par, cl, comp, p: port, vdp }
        return <Connection key={k} {...props} />
    }

    render() {
        const { partitions, state } = this.props
        const connections = []
        let k = 0
        const { parIndex, clIndex, compIndex, portIndex, vdpIndex, connectionType, selectedType } = state
        if (vdpIndex >= 0) {
            let par = partitions[parIndex]
            let cl = par.clusters[clIndex]
            let comp = cl.components[compIndex]
            let port = comp.ports[portIndex]
            let vdp = port.vdps[vdpIndex]
            connections.push(this.createConnectionsForVdp(par, cl, comp, port, vdp, k++))
        } else if (portIndex >= 0) {
            let par = partitions[parIndex]
            let cl = par.clusters[clIndex]
            let comp = cl.components[compIndex]
            let port = comp.ports[portIndex]
            connections.push(this.createConnectionsForPort(par, cl, comp, port, k++))
        } else if (compIndex >= 0) {
            let par = partitions[parIndex]
            let cl = par.clusters[clIndex]
            let comp = cl.components[compIndex]
            connections.push(this.createConnectionsForComp(par, cl, comp, connectionType, k++))
        }
        // partitions.forEach((par, parDx) => {
        //     par.clusters.forEach((cl, clDx) => {
        //         cl.components.forEach((comp, compDx) => {
        //             if (selectedType == 'component' && parIndex==parDx && clIndex==clDx && compIndex==compDx) {
        //                 connections.push(this.createConnectionsForComp(par, cl, comp, connectionType, k++))
        //             } else {
        //                 comp.ports.forEach((port, pDx) => {
        //                     if (selectedType == 'port' && parIndex==parDx && clIndex==clDx && compIndex==compDx && portIndex==pDx) {
        //                         connections.push(this.createConnectionsForPort(par, cl, comp, port, k++))
        //                     } else
        //                         port.vdps.forEach((vdp, vdpDx) => {
        //                             if (selectedType == 'vdp' && parIndex==parDx && clIndex==clDx && compIndex==compDx && vdpIndex==vdpDx) {
        //                                 connections.push(this.createConnectionsForVdp(par, cl, comp, port, vdp, k++))
        //                             }
        //                         })
        //                 })
        //             }
        //         })
        //     })
        // })
        return <div className="connectionview">
            {connections}
        </div>

    }
}


ConnectionsView.defaultProps = {};

export default ConnectionsView;

class Connection extends Component {
    constructor() {
        super();
        this.state = {}
    }
    componentDidMount() {
    }
    render() {
        const { par, cl, comp, p, vdp } = this.props
        const outComps = vdp.outComps || []
        const sender = (<div className="sender br">
            <div className="name">{par.name}</div>
            <div className="name">{cl.name}</div>
            <div className="name">{comp.name}</div>
            <div className="br"><span className="name">{p.name}.{vdp.name}</span></div>
        </div>)
        const reqComps = [].concat(outComps)
        const receivers = reqComps.map((comp, dx) => {
            return <div key={dx} className="receiver br">
                <span className="name">{comp.name}</span>
            </div>
        })
        const connectors = reqComps.map((comp, dx) => {
            return <div className="connector" key={dx}></div>
        })
        return <div className="" style={{}}>
            <div className="fbx connection">
                {sender}
                <div className="connectors">{connectors}</div>
                <div>{receivers}</div>
            </div>
        </div>

    }
}