/* eslint-disable react/prefer-stateless-function */
import React, { Component, PropTypes } from 'react';
import { metrics } from 'react-metrics';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import Modal from 'react-bootstrap/lib/Modal';
import Loadable from 'react-loadable';

import ComponentLoader from 'components/ComponentLoader';
import GlobalNav from 'components/GlobalNav';

import debug from 'helpers/debug';
import config from 'config';
import metricsConfig from 'helpers/metrics';
import Footer from 'components/Footer';
import NoScript from 'components/NoScript';
import { removeMedia } from 'redux/actions/media';
import { removeFootNote } from 'redux/actions/footNote';

import Loader from 'quran-components/lib/Loader';

import { footNoteType } from 'types';

import authConnect from './connect';

const ModalHeader = Modal.Header;
const ModalTitle = Modal.Title;
const ModalBody = Modal.Body;

const GlobalSidebar = Loadable({
  loader: () => import('components/GlobalSidebar'),
  LoadingComponent: ComponentLoader
});

const SmartBanner = Loadable({
  loader: () => import('components/SmartBanner'),
  LoadingComponent: ComponentLoader
});

class App extends Component {
  static propTypes = {
    media: PropTypes.shape({
      content: PropTypes.object
    }).isRequired,
    removeMedia: PropTypes.func.isRequired,
    removeFootNote: PropTypes.func.isRequired,
    children: PropTypes.element,
    main: PropTypes.element,
    nav: PropTypes.element,
    sidebar: PropTypes.element,
    footNote: footNoteType,
    loadingFootNote: PropTypes.bool
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  state = {
    sidebarOpen: false
  }

  render() {
    const {
      main,
      nav,
      children,
      media,
      footNote,
      loadingFootNote,
      removeMedia, // eslint-disable-line no-shadow
      removeFootNote, // eslint-disable-line no-shadow
      ...props
    } = this.props;
    debug('component:APPLICATION', 'Render');
    let footNoteText;

    if (footNote) {
      footNoteText = footNote.text;
    } else {
      footNoteText = <Loader isActive={loadingFootNote} />;
    }

    return (
      <div>
        <Helmet {...config.app.head} />
        <NoScript>
          <div className="row noscript-warning">
            <div className="col-md-12">
              <p>
                Looks like either your browser does not support Javascript or its disabled.
                Quran.com workes best with JavaScript enabled.
                For more instruction on how to enable javascript
                <a href="http://www.enable-javascript.com/">
                  Click here
                </a>
              </p>
            </div>
          </div>
        </NoScript>
        {
          React.cloneElement(
            nav || <GlobalNav isStatic {...props} />,
            {
              handleSidebarToggle: () => this.setState({ sidebarOpen: !this.state.sidebarOpen })
            }
          )
        }
        <GlobalSidebar
          open={this.state.sidebarOpen}
          handleOpen={open => this.setState({ sidebarOpen: open })}
        />
        {children || main}
        <SmartBanner title="The Noble Quran - القرآن الكريم" button="Install" />
        <Footer />

        <Modal bsSize="large" show={media && media.content} onHide={removeMedia}>
          <ModalHeader closeButton>
            <ModalTitle className="montserrat">
              {media.content && media.content.authorName}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div
              className="embed-responsive embed-responsive-16by9"
              dangerouslySetInnerHTML={{ __html: media.content && media.content.embedText }}
            />
          </ModalBody>
        </Modal>

        <Modal bsSize="large" show={!!footNote || loadingFootNote} onHide={removeFootNote}>
          <ModalHeader closeButton>
            <ModalTitle className="montserrat">
              Foot note
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div
              className={`${footNote && footNote.languageName}`}
              dangerouslySetInnerHTML={{ __html: footNoteText }}
            />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const metricsApp = metrics(metricsConfig)(App);
const AsyncApp = asyncConnect([{ promise: authConnect }])(metricsApp);

export default connect(
  state => ({
    media: state.media,
    footNote: state.footNote.footNote,
    loadingFootNote: state.footNote.loadingFootNote
  }),
  { removeMedia, removeFootNote }
)(AsyncApp);
