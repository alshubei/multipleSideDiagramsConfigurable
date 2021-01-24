require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';
import _ from 'lodash'
import Checkbox from './CheckBox'
import Input from './Input'



class EntityPropsPanel extends React.Component {
	constructor(props) {
		super(props)
		this.onEmptyToggle=this.onEmptyToggle.bind(this)
		this.onPropChange=this.onPropChange.bind(this)
		const {propNames} = this.props
		const propObjs = propNames.map(propName=>{
			let o = {}
			o['propName']=propName
			o['value']=''
			o['empty']=false
			return o
		})
		this.state = {
			propObjs:propObjs
		}
	} 
	onEmptyToggle(propIndex, checked) {
		const propSt = this.state.propObjs[propIndex]
		propSt.empty=checked
		this.props.onPropChange(propSt.propName, propSt.value, propSt.empty)
		this.setState({...this.state})
	}
	onPropChange(propIndex, value) {
		const propSt = this.state.propObjs[propIndex]
		propSt.value=value
		this.props.onPropChange(propSt.propName, propSt.value, propSt.empty)
		this.setState({...this.state})
	}

	render() {
		const {propNames} = this.props
		return <div className="br filters">
				<span>Filters:</span>
				<div className="formContainer">
					<div className="rows">
						{(propNames ||[]).map((propName, i)=>{
							const propSt = this.state.propObjs[i] || {empty: false, value: undefined}
							return <div className="column" key={i} >
								<label>{_.upperFirst(propName)}:</label>
								<Checkbox label="Empty" checked={propSt.empty} onChange={this.onEmptyToggle.bind(this, i)}/>
								{propSt.empty ? '' : <Input value={propSt.value} onChange={this.onPropChange.bind(this, i)}/>}
							</div>
						})}
					</div>
				</div>
			</div>
	}
	
}

export default EntityPropsPanel