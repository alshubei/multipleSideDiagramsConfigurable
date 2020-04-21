import React from 'react';

const sortByName = (a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
    if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
    return 0;
}

const isRtePartition = (p, state) => {
    return true //p && p.clusters && p.clusters.length && p.clusters.find(c => isRteCluster(c, state))
}

const isRteCluster = (c, state) => {
    return true //c && c.components && c.components.length && c.components.find(c => isRteComponent(c, state))
}

const isRteComponent = (c) => {
    return true //c && c.ports && c.ports.length //&& c.ports.find(p=>isRtePort(p, state))
}

const isRtePort = (p, state) => {
    return true//p && ((!state.portsWhitelist || !state.portsWhitelist.length) || state.portsWhitelist.find(n => n.trim() == p.name))
}

const isRteVdp = (vdp, state) => {
    return true//vdp && ((!state.portsWhitelist || !state.portsWhitelist.length) || state.portsWhitelist.find(n => n.trim() == vdp.name))
}

const isVdpRequired = (vdp) => {
    return vdp && vdp.outComps && vdp.outComps.length
}

const width = (v, unit) => {
    const u = (unit ? unit : "%")
    return {"width": v+u}
}

const bgc = (v) => {
    return {"backgroundColor": v}
}

export default {
    isRteCluster,
    isRteComponent,
    isRtePartition,
    isRtePort,
    isRteVdp,
    sortByName,
    isVdpRequired,
    width,
    bgc
    
}