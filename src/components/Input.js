require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';
import _ from 'lodash'

class Input extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			value: props.value
		}
	}
	onChange = (e) => {
		this.setState({
			value: e.target.value
		});
		if (this.props.onChange)
			this.props.onChange(e.target.value)
	}
	render() {
		return (
			<label>
				{this.props.label}
				<input type="text"
					value={this.state.value || this.props.value}
					onChange={this.onChange}
				/>
			</label>
		);
	}
}

export default Input