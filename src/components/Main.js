require('normalize.css/normalize.css');
require('styles/App.scss');


import React, { Component } from 'react';
import _ from 'lodash'
import jsonQuery from 'json-query'
import OpenFile from './OpenFile.js'
import EntityPropsPanel from './EntityPropsPanel.js'
import Entity from './Entity'


class AppComponent extends Component {
	constructor(props) {
		super(props);
		this.addOrUpdateSide = this.addOrUpdateSide.bind(this)
		this.closeSide = this.closeSide.bind(this)
		this.editSide = this.editSide.bind(this)
		this.onPropChange = this.onPropChange.bind(this)
		this.onOpenFile = this.onOpenFile.bind(this)
		this.jsonQuery = this.jsonQuery.bind(this) //unncessary
		this.state = {
			sideDescriptors: [
				
			]
		}
	}

	onOpenFile(filePath) {
		this.setState({filePath: filePath})
		fetch(filePath)
			.then((response) => response.json())
			.then((data) => {
				// const state = { "partitions": data.partitions.sort(funcs.sortByName)}
				this.setState({data: {...data}})
			})
			.catch((error) => {
				console.error('Error:', error)
				alert(filePath + ' is a wrong file name. ' + error)
			})
			
	}

	
	addOrUpdateSide(currSide) {
		const sideDescriptors = (currSide=='left'?'leftSideDescriptors':'rightSideDescriptors')
		const currSideSelector = (currSide=='left'?'currLeftSelector':'currRightSelector')
		const selector = this.state[currSideSelector]
		if (selector==undefined || !selector.trim().length) return		
		const newSide = {
			selector: selector,
			labelProp: this.getLabelProp(selector) ,
			side: currSide
		}
		const newState = this.state
		newState[sideDescriptors]=newState[sideDescriptors] ||[]
		newState[sideDescriptors].push(newSide)
		newState[currSideSelector]=''
		this.setState({...newState})
	}
	
	closeSide(index, sideDescriptors) {
		const newState = this.state
		sideDescriptors.splice(index, 1)
		this.setState({...newState})
	}
	editSide(index, side) {
		const newState = this.state
		const allSides = _.flatten([this.state.leftSideDescriptors, this.state.rightSideDescriptors])
		_.forEach(allSides, (sd, i)=>{
			if (i==index && sd.side==side) {
				sd.editing=(sd.editing ? !sd.editing : true)
			} else {
				sd.editing=false
			}
		})
		this.setState({...newState})
	}

	onPropChange(sideDescriptor, propName, propValue, empty) {
		let filt=(sideDescriptor.filters||[]).find(f=>f.propName==propName)
		if (filt) {
			filt['value']=propValue.trim()
			filt['empty']=empty
		}
		else {
			filt={}
			filt['propName']=propName
			filt['value']=propValue.trim()
			filt['empty']=empty
			sideDescriptor.filters=sideDescriptor.filters||[]
			sideDescriptor.filters.push(filt)
		}
		this.setState({...this.state})
	}
	getSideSelector(sideDescriptor){
		const segs = this.getSegments(sideDescriptor.selector)
		return segs.join(".") 	
	}

	getLabelProp(selector) {
		const lastSeg = _.last(this.getSegments(selector))
		return lastSeg.split(":").length>1 ? _.last(lastSeg.split(":")) : 'name'
	}

	getSegments(selector) {
		const lastSeg = _.last(selector.split(".").map(x=>x.trim()))
		return selector.replace(':'+lastSeg, '').split(".")
	}

	jsonQuery(sideDescriptor, data) {
		const selector = this.getSideSelector(sideDescriptor)
		return jsonQuery(selector, {
			data: data
		}).value
	}

	getProperties(data) {
		const entityData = data[0]
		if (entityData) {
			const keys = Object.keys(entityData)
			return keys.filter(k=>k!=="sideDescriptor" && !_.isArray(entityData[k]))
		}
		return []
	}

	filterSideData(data, sideDescriptor) {
		const filtered = data.filter(d=>{
			const filts = sideDescriptor.filters||[]
			if(!filts)
			return true
			const fs = filts.map(f=>{
				const a = _.toLower((d[f['propName']] ||'').toString().trim())
				const b = _.toLower(f.value.trim())
				if(f.empty)
				return a==undefined || a.trim().length==0
				if (!b || !b.length) 
				return true
				return _.includes(a, b)
			})
			return fs.every(b=>b==true)
		})
		return filtered
	}

	onCurrSelectorChange(currSide, e) {
		const v = e.target.value.trim()
		this.state[(currSide=='left'?'currLeftSelector':'currRightSelector')]=v
		this.setState({...this.state})
	}

	render() {
		const createEntitySides = (side) => {
			const entitySides = []
			let sideData
			let propNames
			const sideDescriptors = ((side=='left'?this.state.leftSideDescriptors:this.state.rightSideDescriptors) ||[])
			for (let sideIndex = 0; sideIndex < sideDescriptors.length; sideIndex++) {
				const sideDescriptor = sideDescriptors[sideIndex]
				if (sideIndex==0) {
					sideData = this.jsonQuery(sideDescriptor, this.state.data)
					propNames = this.getProperties(sideData)
					sideData = this.filterSideData(sideData, sideDescriptor)
				} else {
					sideData = this.jsonQuery(sideDescriptor, sideData)
					propNames = this.getProperties(sideData)
					sideData = this.filterSideData(sideData, sideDescriptor)
				}
				let entities = <div className={"fbx drcol " + (sideDescriptor.editing ? 'editing' : '')} key={sideIndex}>				
					<div>
						<button onClick={this.editSide.bind(this, sideIndex, side)}>{sideDescriptor.selector} ({sideData.length})</button> 
						<span className="close" onClick={this.closeSide.bind(this, sideIndex, side)}>x</span>
					</div>
					<div className="fbx br">
						<EntityPropsPanel {...{propNames: propNames, onPropChange:this.onPropChange.bind(this, sideDescriptor)}}/>
						<div className="fbx" >
							<div>{sideData.map((d, i)=><Entity {...{data: d, sideDescriptor: sideDescriptor}} key={i} />)}</div>	
						</div>
					</div>
				</div>
				entitySides.push(entities)
			}
			return entitySides
		}
		
		const leftEntitySides = createEntitySides('left')
		const rightEntitySides = createEntitySides('right')
		const displayIf = (cond) => {
			if (!cond) 
				return 'hide ' 
			else 
				return ''
		}
		
		return (
			<div className="fbx drcol space-bet">
				<OpenFile {...{open: this.onOpenFile}} />
				<div className="fbx space-bet">
					<div className={displayIf(this.state.data) + ' br'}>
						<p>Left side selector:</p>
						{/* <textarea ref={'leftEntityDescriptor'} rows={1} cols={40} defaultValue={"partitions.clusters.components:asil"} /> */}
						<p>partitions.clusters.components:asil</p>
						<textarea rows={1} cols={40} value={this.state.currLeftSelector} onChange={this.onCurrSelectorChange.bind(this, 'left')} />
						<button className="newSide"  onClick={this.addOrUpdateSide.bind(this, 'left')} >✓</button>
						<div className="fbx space-bet">
							{leftEntitySides}
						</div>		
					</div>
					<div className={displayIf(this.state.data)+' fbx alignItemsCenter'}><button className='mrgnLR10'>{ '>' }</button></div>
					<div className={displayIf(this.state.data) + ' br'}>
						<p>Right side selector:</p>
						{/* <textarea ref={'rightEntityDescriptor'} rows={1} cols={40} defaultValue={"partitions.clusters.components:asil"} /> */}
						<textarea rows={1} cols={40} value={this.state.currRightSelector} onChange={this.onCurrSelectorChange.bind(this, 'right')}/>
						<button className="newSide"  onClick={this.addOrUpdateSide.bind(this, 'right')} >✓</button>
						<div className="fbx space-bet">
							{rightEntitySides}
						</div>		
					</div>
				</div>
			</div>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;




