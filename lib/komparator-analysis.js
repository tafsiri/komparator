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
    return string.split('\w');
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
   * Removes tokens that are occure fewer than n times.
   * @param  [String] tokenList A list of strings
   * @param  [Number] n         threshold
   * @return [String]           A list of strings with low frequency terms removed
   * @todo
   */
  removeLowFrequency: function(tokenList, n) {
    return tokenList;
  },

  frequencyTable: function(tokenList) {

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
   * @todo           
   */
  scoreByCount: function(leftCorpus, rightCorpus){
    return {
      "the": 0,
      "cat": 0,
      "in": -0.2,
      "hat": 0.4,
      "sat": -0.9,
      "on": -0.5,
      "mat": 0.5,
    };

  },

  
};
export default KomparatorAnalysis;