require('normalize.css/normalize.css');
require('styles/App.scss');


import React, { Component } from 'react';
import _ from 'lodash'
import jsonQuery from 'json-query'

class OpenFile extends React.Component {
	constructor(props) {
		super(props)
		this.open=this.open.bind(this)
		this.onChange=this.onChange.bind(this)
		this.state = {
			filePath: "../dataSmall.json"
		}
	}
	
	open() {
		const filePath = this.refs.filePath.value.trim()
		this.props.open(filePath)
	}
	
	onChange(e) {
		const v = e.target.value.trim()
		this.setState({filePath: v})
	}

	render() {
		return <div>
			<p>File:</p>
			<input ref={'filePath'} type="text" value={this.state.filePath || "../dataSmall.json"}  onChange={this.onChange} onKeyDown={(e)=>{if (e.key === 'Enter') this.open()}} />
			<button onClick={this.open}> {'>'} </button>
		</div>
	}
}

export default OpenFile