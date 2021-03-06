import React, { PropTypes } from 'react';
import debug from 'helpers/debug';

import { wordType } from 'types';
import Word from 'components/Word';

const styles = require('../Verse/style.scss');

export default class Line extends React.Component {
  static propTypes = {
    line: PropTypes.arrayOf(wordType).isRequired,
    tooltip: PropTypes.string,
    currentVerse: PropTypes.string.isRequired,
    audioActions: PropTypes.shape({
      pause: PropTypes.func.isRequired,
      setAyah: PropTypes.func.isRequired,
      play: PropTypes.func.isRequired,
      setCurrentWord: PropTypes.func.isRequired,
    }),
    isPlaying: PropTypes.bool,
    useTextFont: PropTypes.bool
  };

  // NOTE: this is commented out as it caused problems with 55:31 with missing text.
  // shouldComponentUpdate(nextProps) {
  //   const conditions = [
  //     this.props.currentVerse !== nextProps.currentVerse,
  //     this.props.line !== nextProps.line,
  //     this.props.isPlaying !== nextProps.isPlaying
  //   ];
  //
  //   console.log(conditions, conditions.some(condition => condition));
  //
  //   return conditions.some(condition => condition);
  // }

  renderText() {
    const { tooltip, currentVerse, audioActions, isPlaying, line, useTextFont } = this.props;

    const text = line.map(word => (
      <Word
        word={word}
        key={`${word.position}-${word.code}-${word.lineNum}`}
        currentVerse={currentVerse}
        tooltip={tooltip}
        isPlaying={isPlaying}
        audioActions={audioActions}
        useTextFont={useTextFont}
      />
    ));

    return (
      <span className={`${styles.line} text-center`}>
        {text}
      </span>
    );
  }

  render() {
    const { line } = this.props;

    debug(
      'component:Line',
      `Page: ${line[0].pageNum} - Line: ${line[0].lineNum} - Ayah: ${line[0].verseKey}`
    );

    return (
      <div className={`row ${styles.font} text-justify text-arabic`}>
        <div className="col-md-12 line-container" name={`ayah:${line[0].verseKey}`}>
          {this.renderText()}
        </div>
      </div>
    );
  }
}
