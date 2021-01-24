require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';
import _ from 'lodash'

class Checkbox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			checked: props.checked
		}
	}
	onChange = (e) => {
		this.setState({
			checked: e.target.checked
		});
		if (this.props.onChange)
			this.props.onChange(e.target.checked)
	}
	render() {
		return (
			<label>
				<input type="checkbox"
					checked={this.state.checked}
					onChange={this.onChange}
					/>
				{this.props.label}
			</label>
		);
	}
}

export default Checkbox