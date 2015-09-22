import _ from 'lodash';
import d3 from 'd3';


export default class Komparator {
  constructor(options) {
    this.data = _.clone(options.data, true);
    this._container = options.container;

    if(typeof this.container === 'string') {
      this._container = document.querySelector(this._container);
    }

    this.container = d3.select(this._container);

    this.update();
    this.initialRender();
    this.render();
  }

  update() {
    console.log('update', this.container.node().getBoundingClientRect());

    this.width = this._container.clientWidth;
    this.height = this._container.clientHeight;
  }

  initialRender() {
    console.log('initial render');
    
    // this.height = 500;
    // this.width = 500;

    var self = this;
    var svg = this.container.append('svg')
      .attr('id', 'komparator')
      .attr('height', this.height)
      .attr('width', this.width);

    // Background rect
    this.bgRect = svg.append('rect')
      .attr('class', 'background')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'white');
      // .attr('fill', '#e1e1e1'); // TODO remove

    var g = svg.append("g")
      .attr("class", "vis-group");

    g.append("line")
      .attr('class', 'lCorpus-line-top');

    g.append("line")
      .attr('class', 'rCorpus-line-top');

    g.append("line")
      .attr('class', 'lCorpus-line-bottom');

    g.append("line")
      .attr('class', 'rCorpus-line-bottom');

    g.append('text')
      .attr('class', 'lCorpus-section-label')
      .text('Left');

    g.append('text')
      .attr('class', 'rCorpus-section-label')
      .text('Right');

    this.adjectivesGroup = g.append("g")
      .attr('class', 'adjectives-group');

    this.lCorpusAdjGroup = g.append("g")
      .attr('class', 'lCorpus-adjs');
    this.rCorpusAdjGroup = g.append("g")
      .attr('class', 'rCorpus-adjs');

    this.detailsContainer = this.container.append('div')
      .attr('id', 'details-container');

  }

  render() {
    console.log('render');

    this.container.select('svg')
      .attr('height', this.height)
      .attr('width', this.width);

    this.renderAxesAndTitles();
  }

  renderAxesAndTitles() {
    this.container.select('line.lCorpus-line-top')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', this.width / 2)
      .attr('y2', 0);

    this.container.select('line.rCorpus-line-top')
      .attr('x1', this.width / 2)
      .attr('y1', 0)
      .attr('x2', this.width)
      .attr('y2', 0);

    this.container.select('line.lCorpus-line-bottom')
      .attr('x1', 0)
      .attr('y1', this.height)
      .attr('x2', this.width / 2)
      .attr('y2', this.height);

    this.container.select('line.rCorpus-line-bottom')
      .attr('x1', this.width / 2)
      .attr('y1', this.height)
      .attr('x2', this.width)
      .attr('y2', this.height);

    this.container.select('text.lCorpus-section-label')
      .attr('x', 0)
      .attr('y', 30)
      .attr('text-anchor', 'start');

    this.container.select('text.rCorpus-section-label')
      .attr('x', this.width - 5)
      .attr('y', 30)
      .attr('text-anchor', 'end');
  }
}