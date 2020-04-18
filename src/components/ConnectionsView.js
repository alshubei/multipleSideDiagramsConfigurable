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

    render() {
        const { partitions, state } = this.props
        // const allComponents = _.flattenDepth(partitions.map(x => (x.clusters || []).map(x => x.components)), 2)
        // const allVdps = _.flattenDepth(allComponents.map(c => c.ports.map(p => p.vdps)), 2)
        // const connectionDiagrams = allVdps.filter(vdp => vdp.refs && funcs.isRteVdp(vdp, state)).map((vdp, dx) => {
        //     const p1 = vdp.refs["vdp_" + vdp.name]
        //     return vdp.toComps.filter(c => c.component.refs).map((tc, dx) => {
        //         const comp = tc.component
        //         const p2 = comp.refs["comp_" + comp.name]
        //         const p1Rect = p1.getBoundingClientRect()
        //         const p2Rect = p2.getBoundingClientRect()
        //         const x1 = p1Rect.left + (p1Rect.width / 2);
        //         const y1 = p1Rect.top + (p1Rect.height / 2);
        //         const x2 = p2Rect.left + (p2Rect.width / 2);
        //         const y2 = p2Rect.top + (p2Rect.height / 2);
        //         return <line x1={x1 - 30} y1={y1 - 15} x2={x2 - 30} y2={y2 - 40} style={lineStyle} />
        //     })
        // })
        // const lineStyle = {
        //     "strokeWidth": "2px",
        //     "stroke": "red",
        // }
        // const svgStyle = {
        //     "height": "100%",
        //     "width": "100%",
        //     "border": "1px solid",
        //     // "position": "absolute"
        // }
        // <svg style={svgStyle}>{connectionDiagrams}</svg>
        const connections = []
        const draw = this.props.draw
        let k = 0
        partitions.forEach((par, parDx) => {
            par.clusters.forEach((cl, clDx) => {
                cl.components.forEach((comp, compDx) => {
                    comp.ports.forEach((p, pDx) => {
                        p.vdps.forEach((vdp, vdpDx) => {
                            if (vdp.selected) {
                                let props = { par, cl, comp, p, vdp, draw }
                                connections.push(<Connection key={k++} {...props} />)
                            }
                        })
                    })
                })
            })
        })
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
        this.setState({ refs: this.refs })
    }
    render() {
        const { par, cl, comp, p, vdp } = this.props
        const toComps = vdp.toComps
        const sender = (<div className="br">
            <div className="name">{par.name}</div>
            <div className="name">{cl.name}</div>
            <div className="name">{comp.name}</div>
            <div className="br"><span className="name" ref={'vdp_' + vdp.name}>{p.name}.{vdp.name}</span></div>
        </div>)
        const receivers = [].concat(toComps).map((comp, dx) => {
            return <div key={dx} className="br">
                <span className="name" ref={"comp_" + comp.component.name}>{comp.component.name}</span>
            </div>
        })
        const lineStyle = {
            "strokeWidth": "1px",
            "stroke": "green",
        }
        const svgStyle = {
            "height": "100%",
            "width": "100%",
            "border": "1px solid",
            "position": "absolute",
            "top": 0,
            "left": 0
        }
        const connections = []
        const p1 = (this.refs && this.refs["vdp_" + vdp.name]) ? this.refs["vdp_" + vdp.name] : null
        if (p1) {
            const p1Rect = p1.getBoundingClientRect()
            const p2Rects = vdp.toComps.map((c) => {
                const refName = "comp_" + c.component.name
                const p2 = (this.refs && this.refs[refName]) ? this.refs[refName] : null
                return p2 ? p2.getBoundingClientRect() : null
            }).filter(x => x)
            p2Rects.forEach((p2Rect, dx) => {
                const x1 = p1Rect.left + (p1Rect.width / 2);
                const y1 = p1Rect.top + (p1Rect.height / 2);
                const x2 = p2Rect.left + (p2Rect.width / 2);
                const y2 = p2Rect.top + (p2Rect.height / 2);
                connections.push(<svg key={dx} style={svgStyle}><line x1={x1 - 30} y1={y1 - 15} x2={x2 - 30} y2={y2 - 40} style={lineStyle} /></svg>)
            })
        }
        return <div className="">
            <div className="fbx connection">
                <div>{sender}</div>
                <div>{receivers}</div>
            </div>
            {connections}
        </div>

    }
}