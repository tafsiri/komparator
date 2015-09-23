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

    this.update();
    this.initialRender();
    this.render();
  }

  update(options) {
    this.width = this._container.clientWidth;
    this.height = this._container.clientHeight;

    // var leftText = options.left;
    // var rightText = options.right;

    var leftText = "there";
    var rightText = "hi";

    var scores;
    if(leftText && rightText) {
      scores = KomparatorAnalysis.scoreByCount(leftText, rightText);
    }
    console.log('text scores', scores);

    this.tokens = _.pairs(scores);

    var exp = 0.5;
    this.x  = d3.scale.pow()
      .exponent(exp)
      .domain([-1, 0, 1])
      .range([this.margins.left, this.width / 2, this.width - this.margins.right]);

    this.fontSize = d3.scale.linear()
      .domain(d3.extent(_.map(this.tokens, function(d){
        return d[1];
      })))
      .range([14, 32]);
    

  }

  initialRender() {
    console.log('initial render');
    
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
      .attr('fill', 'white')
      .attr('opacity', 0.5);
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

    this.tokensGroup = g.append("g")
      .attr('class', 'tokens-group');

    this.detailsContainer = this.container.append('div')
      .attr('id', 'details-container');

  }

  render() {
    console.log('render');
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
      .attr('text-anchor', 'start');

    this.container.select('text.rCorpus-section-label')
      .attr('x', this.width - 5)
      .attr('y', 30)
      .attr('text-anchor', 'end');
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

        return "translate(" + x + "," + y + ")";
      });
      // .on('mouseover', mouseovered)
      // .on('mouseout', mouseouted)
      // .on('click', mouseclicked);

    tokensEnter.append("rect")
      .attr("class", function(d){
        return "node-bg";
      });

    tokensEnter.append("text")
      .attr("class", "node-text")
      .attr('text-anchor', 'middle')
      // .attr('opacity', function(d) {
      //   return 1;
      // })
      .text(function(d) { return d[0]; });

    tokens.selectAll('text.node-text')
      .style('font-size', function(d, i) {
        return self.fontSize(1) + "px";
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

      return "translate(" + pos.x + "," + pos.y + ")";
    });

    tokens.selectAll('rect.node-bg')
      .transition()
      .duration(transitionDuration)
      .call(positionAdjectiveBackground);

    function positionAdjectiveBackground(d, i, highlight) {
      this
        .attr('opacity', 0.35)
        .attr('stroke', 'none')
        .each(function(d, i) {
          var text = this.nextSibling;
          var bb = text.getBBox();

          var x,y, width, height;

          if (d === self.currentlySelectedAdj || highlight) {
            x = -(bb.width/2) - 6;
          } else {
            x = -bb.width/2;
          }

          if (d === self.currentlySelectedAdj || highlight) {
            y = -bb.height + 1;
          } else {
            y = -bb.height / 4;
          }

          if (d === self.currentlySelectedAdj || highlight) {
            height = bb.height + 8;
          } else {
            height = bb.height / 2;
          }

          if (d === self.currentlySelectedAdj || highlight) {
            width =  bb.width + 12;
          } else {
            width = bb.width + 10;
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


  }
}