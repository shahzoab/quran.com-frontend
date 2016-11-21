import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';

import IndexHeader from 'components/IndexHeader';
import FacebookButton from 'components/FacebookButton';

export default () => (
  <div>
    <IndexHeader noSearch />
    <Grid>
      <Row>
        <Col md={6} mdOffset={3} className="text-center">
          <Panel>
            <h2>
              Login
            </h2>
            <FacebookButton />
          </Panel>
        </Col>
      </Row>
    </Grid>
  </div>
);
