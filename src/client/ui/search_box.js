(function() {
  "use strict";

  var React = require("../../shared/react");
  var d = React.DOM;
  var _ = require("lodash");
  
  var controlWidth = 350;

  var Styles = {
    searchInput: {
      width: controlWidth
    },
    searchResults: {
      width: controlWidth,
      border: "1px solid #aaa"
    }
  };

  var SearchBox = React.createClass({
    getInitialState: function() {
      return { searchTerm: '', searchResults: null };
    },
    render: function() {
      return d.div(null,
                   d.input({type: 'text',
                            placeholder: 'Item to search for',
                            onChange: this.onSearchTermChanged,
                            value: this.state.searchTerm,
                            style: Styles.searchInput}),
                   d.ul({style: Styles.searchResults},
                        _.map(this.state.searchResults, this.renderSearchResult))
                  );
    },
    renderSearchResult: function(searchResult, resultIdx){
      var spans = [],
          strIdx = 0,
          i,
          str,
          spanCounter = 0;

      if (!searchResult.matches) {
        return d.li({key: resultIdx}, searchResult.value);
      }

      var matchesLength = searchResult.matches.length;

      for (i = 0; i < matchesLength; i += 1) {
        var start = searchResult.matches[i].start;
        var end = searchResult.matches[i].end;
        
        if (start > strIdx) {
          str = searchResult.value.substring(strIdx, start);
          spans.push(d.span({className: 'unmatched-range', key: spanCounter++}, str));
        }
        str = searchResult.value.substring(start, end);
        spans.push(d.span({className: 'matched-range', key: spanCounter++} , str));
        strIdx = end;
      }

      if (strIdx < searchResult.value.length) {
        str = searchResult.value.substring(strIdx);
        spans.push(d.span({key: spanCounter++, className: 'unmatched-range'}, str));
      }
      
      return d.li({
        'data-result': JSON.stringify(searchResult), // only for debugging
        key: resultIdx
      }, spans);
    },
    onSearchTermChanged: function(e) {
      var newSearchTerm = e.target.value;
      var newSearchResults = this.props.searchFn(newSearchTerm);
      this.setState({searchTerm: newSearchTerm,
                     searchResults: newSearchResults});
    }
  });

  module.exports = SearchBox;
  
}());
