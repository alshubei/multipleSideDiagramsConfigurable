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

const isRteComponent = (c, state) => {
    return c && (
        (c.inVdps && c.inVdps.length) ||
        c.ports && c.ports.length && c.ports.find(p => isRtePort(p, state))
    )
}

const isRtePort = (p, state) => {
    //p && ((!state.portsWhitelist || !state.portsWhitelist.length) || state.portsWhitelist.find(n => n.trim() == p.name))
    return p && p.vdps && p.vdps.length && p.vdps.find(v => isRteVdp(v, state))
}

const isRteVdp = (vdp, state) => {
    if (!state.filters) return true
    const connFilter = state.filters.find(f => f.type == 'onlyConnected')
    const connected = (connFilter && connFilter.value) && (vdp && vdp.outComps && vdp.outComps.length)
    const whitelistFilter =  state.filters.find(f => f.type == 'whitelist')
    const inWhitelist = (whitelistFilter && whitelistFilter.value) && (state.portsWhitelist || []).find(n => n.trim() == vdp.name)
    const b = connected || inWhitelist
    return b
}

const isVdpRequired = (vdp) => {
    return vdp && vdp.outComps && vdp.outComps.length
}

const isPortRequired = (port) => {
    return port && port.vdps && port.vdps.find(vdp=>{
        return vdp && vdp.outComps && vdp.outComps.length
    })
}

const width = (v, unit) => {
    const u = (unit ? unit : "%")
    return { "width": v + u }
}

const bgc = (v) => {
    return { "backgroundColor": v }
}

const showName = (x, xIndex, pref, state) => {
    const filter = state.filters && state.filters.find(f => f.type == 'showName')
    if (filter.value)
        return x.name
    return pref + (xIndex + 1)

}

export default {
    isRteCluster,
    isRteComponent,
    isRtePartition,
    isRtePort,
    isRteVdp,
    sortByName,
    isVdpRequired,
    isPortRequired,
    showName,
    width,
    bgc

}