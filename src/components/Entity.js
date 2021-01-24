require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';
import _ from 'lodash'


class Entity extends React.Component {
	constructor(props) {
		super(props)
		this.onExpandClick=this.onExpandClick.bind(this)
		this.state = {selected: false, expand: false}
	}	
	onExpandClick() {
		this.setState({expand: !this.state.expand})
	}

	render() {
		const {data, sideDescriptor} = this.props
		const {selected, expand} = this.state
		return <div className={"br entity " + (selected ? "selected" : "")}>
			<div>
				
				<button onClick={this.onExpandClick}>
					{(expand ? '-' : '+')}
					{(expand ? '' : (sideDescriptor.labelProp ? data[sideDescriptor.labelProp] : data.name))}
				</button>	
				<div className={'hide ' + (expand ? ' expand' :  '')}>
					{Object.keys(data).map((k, i)=>{
						const value = (_.isArray(data[k]) ? k+'[]' : k+':'+data[k])
						return <div key={i}>{value}</div>
					})}
				</div>
			</div>
		</div>
	}
}


export default Entity