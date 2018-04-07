import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import * as d3 from 'd3';

export default class D3 extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._render(this.props);
  }
  
  componentDidUpdate() {
    this._render(this.props);
  }
 
  _render({width, text, radius}) {
    const root = d3.select(findDOMNode(this.svg));
    const g = root.select('g');
    const circle = g.selectAll('circle')
      .data([radius])
      .attr('r', d => d)
      .enter()
      .append('circle')
      .attr('cx', width/2)
      .attr('cy', width/2)
      .style('stroke', '#000')
      .style('strokeWeight', 2)
      .style('fill', '#888')
    ;

    const textElement = g.selectAll('text')
      .data([text])
      .text(text)
      .enter()
      .append('text')
      .style('fill', '#000')
      .style('fontSize', '20px')
      .attr('x', width/2)
      .attr('y', width/2);
  }

  render() {
    const {width, label} = this.props;
    return (
      <div>
        <svg
          width={width}
          height={width === 0 ? 0 : width}
          ref={svg => this.svg = svg}>
          <g>
          </g>
        </svg>
      </div>
    );
  }
}
