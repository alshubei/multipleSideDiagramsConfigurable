import React from 'react';

const sortByName = (a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
    if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
    return 0;
}

const isRtePartition = (p, state) => {
    return p && p.clusters && p.clusters.length && p.clusters.find(c => isRteCluster(c, state))
}

const isRteCluster = (c, state) => {
    return c && c.components && c.components.length && c.components.find(c => isRteComponent(c, state))
}

const isRteComponent = (c) => {
    return c && c.ports && c.ports.length //&& c.ports.find(p=>isRtePort(p, state))
}

const isRtePort = (p, state) => {
    return p && ((!state.portsWhitelist || !state.portsWhitelist.length) || state.portsWhitelist.find(n => n.trim() == p.name))
}

const isRteVdp = (vdp, state) => {
    return vdp && ((!state.portsWhitelist || !state.portsWhitelist.length) || state.portsWhitelist.find(n => n.trim() == vdp.name))
}

const isVdpRequired = (vdp) => {
    return vdp && vdp.toComps && vdp.toComps.length
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