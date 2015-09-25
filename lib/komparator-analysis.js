import _ from 'lodash';

var KomparatorAnalysis = {

  /**
   * Provides simple tokenization of text.
   *
   * Input text is tokenized by splitting on whitespace.
   * 
   * @param  {String} string input string
   * @return [String]        list of tokens
   */
  tokenize: function(string) {
    return _.map(string.split(/\W/), (s) => s.toLowerCase());
  },


  /**
   * Removes tokens that are identified as stopwords.
   * @param  [String] tokenList A list of strings
   * @return [String]           A list of strings with stopwords removed
   * @todo
   */
  removeStopWordTokens: function(tokenList) {
    return tokenList;
  },

  /**
   * Removes tokens that are identified as stopwords.
   * @param  [String] tokenList A list of strings
   * @return [String]           A list of strings with stopwords removed
   * @todo
   */
  removePunctuationTokens: function(tokenList) {
    return tokenList;
  },  

  /**
   * Removes tokens that occur n or fewer times.
   * @param  [String] tokenList A list of strings
   * @param  [Number] n         threshold
   * @return [String]           A list of strings with low frequency terms removed
   * @todo
   */
  removeLowFrequency: function(tokenList, n) {
    var freqTable = KomparatorAnalysis.frequencyTable(tokenList);
    var res = [];
    _.each(tokenList, function(token){
      if(freqTable[token] > n){
        res.push(token);
      }
    });
    return res;
  },

  frequencyTable: function(first, ...rest) {
    var all = first.concat.apply(first, rest);
    // console.log("frequencyTable", first.length, rest[0].length, all.length)
    var res = _.countBy(all, _.identity);
    // console.log(res);
    return res;
  },

  /**
   * Scores all the terms on a scale from -1 to 1
   * based on whether it occurs more in one corpus or another
   * 
   * A term that only appears in leftCorpus would recieve a score of -1
   * A term that appears only in rightCorpus would have a score of 1.
   * A term that appears equally in both copora would have a score of zero.
   * Other scores in range are assigned as appropriate based on relative frequency.
   * 
   *
   * @param  [String] leftCorpus  a list of strings/tokens 
   * @param  [String] rightCorpus a list of strings/tokens 
   * @return {Object}             a dictionary of strings to scores.  
   *           
   */
  scoreByCount: function(leftCorpus, rightCorpus){
    var combined = leftCorpus.concat(rightCorpus);
    
    var combinedFrequencies = _.countBy(combined, _.identity);
    var leftFrequencies = _.countBy(leftCorpus, _.identity);
    var rightFrequencies = _.countBy(rightCorpus, _.identity);

    var scores = _.reduce(_.keys(combinedFrequencies), function(memo, token){
      var count = combinedFrequencies[token];
      var lf = leftFrequencies[token];
      var rf = rightFrequencies[token];

      if(rf === undefined){
        memo[token] = -1;
      } else if (lf === undefined){
        memo[token] = 1;
      } else if(lf === rf){
        memo[token] = 0;
      } else if(lf > rf) {
        memo[token] = ((lf - rf) / count) * - 1;
      } else if(lf < rf) {
        memo[token] = ((rf - lf) / count);
      }
      return memo;
    }, {});
    return scores;
  },

  
};
export default KomparatorAnalysis;