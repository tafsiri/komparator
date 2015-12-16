import _ from 'lodash';
import d3 from 'd3';
import KomparatorAnalysis from './komparator-analysis';

export default class Komparator {
  constructor(options) {
    this.data = _.clone(options.data, true);
    this._container = options.container;

    if(typeof this.container === 'string') {
      this._container = document.querySelector(this._container);
    }

    this.container = d3.select(this._container);

    this.margins = {
      left: 50,
      right: 50,
      top: 50,
      bottom: 50
    };

    this.filterFunctions = [];

    this.currentlySelectedToken = null;

    this.update('', '', {});
    this.initialRender();
  }

  update(left, right, options) {

    var leftTokens, rightTokens;

    var minTokenFreq = options.minimumFrequency || 0;
    var showUniqueTerms = options.showUniqueTerms || false;

    if(left.length === 0 || right.length === 0) {
      left = 'enter text left left right';
      right = 'enter text right right left';
    }

    if(_.isString(left)) {
      leftTokens = KomparatorAnalysis.tokenize(left);
    } else {
      leftTokens = left;
    }
    if(_.isString(right)) {
      rightTokens = KomparatorAnalysis.tokenize(right);
    } else {
      rightTokens = right;
    }


    if(!options.showStopWords) {
      rightTokens = KomparatorAnalysis.removeStopWordTokens(rightTokens);
      leftTokens = KomparatorAnalysis.removeStopWordTokens(leftTokens);
    }

    // Count and score the tokens then build a map of tokens to counts
    // and scores.
    var counts = KomparatorAnalysis.frequencyTable(leftTokens, rightTokens);
    var scores = KomparatorAnalysis.scoreByCount(leftTokens, rightTokens);

    this.tokens = _.map(_.keys(scores), function(key){
      return [key, scores[key], counts[key]];
    });

    // Filter out terms that appear less than a user specified number of
    // times

    this.tokens = _.filter(this.tokens, function(token){
      if(showUniqueTerms){
        return token[2] > minTokenFreq;
      } else {
        return token[1] !== 1 && token[1] !== -1 && token[2] > minTokenFreq;
      }
    });

    // Reset Scales
    this.width = parseInt(this.container.style('width'), 10);

    var exp = 0.5;
    this.x  = d3.scale.pow()
      .exponent(exp)
      .domain([-1, 0, 1])
      .range([this.margins.left, this.width / 2, this.width - this.margins.right]);

    this.fontSize = d3.scale.linear()
      .domain(d3.extent(_.map(this.tokens, function(d){
        return d[2];
      })))
      .range([12, 64]);
  }

  initialRender() {
    var self = this;
    this.width = this._container.clientWidth;
    this.height = this._container.clientHeight;

    var svg = this.container.append('svg')
      .attr('id', 'komparator')
      .attr('height', this.height)
      .attr('width', this.width);

    // Background rect
    this.bgRect = svg.append('rect')
      .attr('class', 'background')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'white')
      .attr('opacity', 0.5);
      // .attr('fill', '#e1e1e1'); // TODO remove

    var g = svg.append('g').attr('class', 'vis-group');

    g.append('line').attr('class', 'lCorpus-line-top');
    g.append('line').attr('class', 'rCorpus-line-top');
    g.append('line').attr('class', 'lCorpus-line-bottom');
    g.append('line').attr('class', 'rCorpus-line-bottom');
    g.append('text').attr('class', 'lCorpus-section-label');
    g.append('text').attr('class', 'rCorpus-section-label');


    this.tokensGroup = g.append('g').attr('class', 'tokens-group');

    this.detailsContainer = this.container.append('div')
      .attr('id', 'details-container');

  }

  render() {
    this.boundingBoxes = [];

    this.container.select('svg')
      .attr('height', this.height)
      .attr('width', this.width);

    this.renderAxesAndTitles();
    this.renderText();
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
      .attr('text-anchor', 'start')
      .text('Left');

    this.container.select('text.rCorpus-section-label')
      .attr('x', this.width - 5)
      .attr('y', 30)
      .attr('text-anchor', 'end')
      .text('Right');
  }

  renderText() {
    var self = this;

    var tokens = this.tokensGroup.selectAll('.token')
      .data(this.tokens, function(d) { return d[0]; });

    var tokensEnter = tokens.enter()
      .append('g')
      .attr('class', function(d){
        return 'token';
      })
      .attr('transform', function(d) {
        // Initial positioning. Will be refined during collision
        // resolution
        var x = d[1] < 0 ? -250 : self.width + 250;

        var y = Math.random() * self.height;

        return 'translate(' + x + ',' + y + ')';
      })
      .on('mouseover', mouseovered)
      .on('mouseout', mouseouted)
      .on('click', mouseclicked);

    tokensEnter.append('rect')
      .attr('class', function(d){
        return 'node-bg';
      });

    tokensEnter.append('text')
      .attr('class', 'node-text')
      .attr('text-anchor', 'middle')
      // .attr('opacity', function(d) {
      //   return 1;
      // })
      .text(function(d) { return d[0]; });

    tokens.selectAll('text.node-text')
      .style('font-size', function(d, i) {
        return self.fontSize(d[2]) + 'px';
      });

  var direction = 0;
  function getNextFreeSpace(bb, allBoundingBoxes) {
    var potential = _.extend({}, bb);

    var sx1 = potential.x;
    var sy1 = potential.y;
    var sx2 = potential.x + potential.width;
    var sy2 = potential.y + potential.height;

    // If a collision is detected while we are looping through
    // we will continue checking against the rest of the bounding
    // boxes in case the
    var reLoop = false;

    for (var i = 0; i < allBoundingBoxes.length; i++) {
      var target = allBoundingBoxes[i];

      var tx1 = target.x;
      var ty1 = target.y;
      var tx2 = target.x + target.width;
      var ty2 = target.y + target.height;

      var intersects = (sx1 < tx2 && sx2 > tx1 && sy1 < ty2 && sy2 > ty1);
      if (intersects) {
        reLoop = true;
        var sign = direction % 2 === 0 ? -1 : 1;
        potential.y += potential.height * sign;
        sy1 = potential.y;
        sy2 = potential.y + potential.height;
      }

      if(i === allBoundingBoxes.length - 1 && reLoop ){
        i = 0;
        reLoop = false;
      }
    }

    direction += 1;
    return potential;
  }

  var transitionDuration = 200;

  tokens
    .transition()
    .duration(transitionDuration)
    .attr('transform', function(d) {
      var vPadding = 2;
      var hPadding = 5;
      var bb = d3.select(this).select('text.node-text').node().getBBox();

      var x = self.x(d[1]);
      var y = (self.height / 2);

      var width = bb.width;
      var height = bb.height;

      var pos = getNextFreeSpace({
        x: x,
        y: y,
        width: width + hPadding,
        height: height + vPadding,
        data: d,
        node: this
      }, self.boundingBoxes);

      // Clamp y values to the bounding box of the chart
      // this also makes sure the quadTree wont throw exceptions
      // on traversal.
      if (pos.y > self.height - 20) {
        pos.y = self.height - 20;
      }

      if (pos.y < 20) {
        pos.y = 20;
      }

      self.boundingBoxes.push(pos);

      return 'translate(' + pos.x + ',' + pos.y + ')';
    });

    tokens.selectAll('rect.node-bg')
      .transition()
      .duration(transitionDuration)
      .call(positionAdjectiveBackground);

    function positionAdjectiveBackground(d, i, highlight) {
      this
        .attr('opacity', 0.0)
        .attr('stroke', 'none')
        .each(function(d, i) {
          var text = this.nextSibling;
          var bb = text.getBBox();

          var x,y, width, height;

          if (d === self.currentlySelectedToken || highlight) {
            x = -(bb.width/2) - 6;
          } else {
            x = -bb.width/2;
          }

          if (d === self.currentlySelectedToken || highlight) {
            y = -bb.height;
          } else {
            y = -bb.height/2;
          }

          if (d === self.currentlySelectedToken || highlight) {
            height = bb.height + 6;
          } else {
            height = bb.height/2;
          }

          if (d === self.currentlySelectedToken || highlight) {
            width =  bb.width + 12;
          } else {
            width = bb.width;
          }


          var pos = {
            x: x, y: y, width: width, height: height
          };

          d3.select(this)
            .transition()
            .duration(50)
            .attr(pos);
        });
    }

    tokens.exit()
      .remove();


    //Mouse Handlers

    // Handle mouseover
    //
    // To support locked selections, it will check if there is a selected
    // adjective before adjusting what should be highlighted.
    function mouseovered(d) {
      if(_.isNull(self.currentlySelectedToken)){
        self.container.select('svg').selectAll('g.token').classed('active', false);
        d3.select(this).classed('active', true);
        this.parentNode.appendChild(this);
      } else {
        return;
      }
    }


    // Handle mouseout
    //
    // To support locked selections, it will check if there is a selected
    // adjective before adjusting what should be unhighlighted.
    function mouseouted() {
      if(_.isNull(self.currentlySelectedToken)){
        d3.select(this).classed('active', false);
      } else {
        return;
      }
    }

    // Handle clicking on adjectives. Basically uses the mouseout and mouseover
    // functions to lock a selection and highlight it.
    function mouseclicked(d) {
      if(self.currentlySelectedToken === d){
        self.currentlySelectedToken = null;
        mouseouted.bind(this)();
        // self.hideAdjectiveDetailOverlay();
      } else {
        mouseouted.bind(this)();
        self.currentlySelectedToken = null;
        mouseovered.bind(this)(d);
        self.currentlySelectedToken = d;
        var node = this;
        setTimeout(function(){
          //self.showAdjectiveDetailOverlay(node, d);
        }, 50);
      }

      self.container.selectAll('rect.node-bg')
        .transition()
        .duration(50)
        .call(positionAdjectiveBackground);

    }


  }
}