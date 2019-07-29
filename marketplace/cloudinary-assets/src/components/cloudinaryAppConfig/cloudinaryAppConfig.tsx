import * as React from 'react';

import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import {
  Heading,
  Paragraph,
  Spinner,
  Typography,
  TextField,
  Form
} from '@contentful/forma-36-react-components';
import { Workbench } from '@contentful/forma-36-react-components/dist/alpha';

import {
  toExtensionParameters,
  InputParameters,
  toInputParameters,
  validateParamters,
  MAX_FILES_UPPER_LIMIT
} from './parameters';

interface Props {
  sdk: AppExtensionSDK;
}

interface State {
  ready: boolean;
  contentTypes: Record<string, any>[];
  currentState: Record<string, any> | null;
  parameters: InputParameters;
}

export default class CloudinaryAppConfig extends React.Component<Props, State> {
  state = {
    ready: false,
    contentTypes: [],
    currentState: null,
    parameters: toInputParameters(null)
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { space, platformAlpha } = this.props.sdk;

    platformAlpha.app.onConfigure(this.onAppConfigure);

    const [contentTypesResponse, currentState, parameters] = await Promise.all([
      space.getContentTypes(),
      platformAlpha.app.getCurrentState(),
      platformAlpha.app.getParameters()
    ]);

    this.setState({
      ready: true,
      contentTypes: contentTypesResponse.items,
      currentState,
      parameters: toInputParameters(parameters)
    });
  };

  onAppConfigure = () => {
    const { parameters } = this.state;
    const error = validateParamters(parameters);

    if (error) {
      this.props.sdk.notifier.error(error);
      return false;
    }

    return {
      parameters: toExtensionParameters(parameters)
    };
  };

  render() {
    return (
      <Workbench>
        <Workbench.Content>
          {this.state.ready ? this.renderApp() : this.renderLoader()}
        </Workbench.Content>
      </Workbench>
    );
  }

  renderLoader() {
    return (
      <Paragraph>
        Loading <Spinner />
      </Paragraph>
    );
  }

  onParameterChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    this.setState(state => ({
      ...state,
      parameters: { ...state.parameters, [key]: value }
    }));
  };

  renderApp() {
    const { parameters } = this.state;

    return (
      <>
        <Typography>
          <Heading>Cloudinary account</Heading>
          <Paragraph>Provide details of your Cloudinary account so we can connect to it.</Paragraph>
          <Form>
            <TextField
              required={true}
              id="cloud-name-input"
              name="cloud-name-input"
              labelText="Cloud name"
              textInputProps={{
                width: 'large',
                maxLength: 50
              }}
              helpText="The cloud_name of the account to access."
              value={parameters.cloudName}
              onChange={this.onParameterChange.bind(this, 'cloudName')}
            />
            <TextField
              required={true}
              id="api-key-input"
              name="api-key-input"
              labelText="API key"
              textInputProps={{
                width: 'large',
                type: 'password',
                maxLength: 50
              }}
              helpText="The account API key."
              value={parameters.apiKey}
              onChange={this.onParameterChange.bind(this, 'apiKey')}
            />
          </Form>

          <Heading>Configuration</Heading>
          <Form>
            <TextField
              required={true}
              id="max-files-input"
              name="max-files-input"
              labelText="Max number of files"
              textInputProps={{
                width: 'medium',
                type: 'number'
              }}
              helpText={`Max number of files that can be added to a single field. Between 1 and ${MAX_FILES_UPPER_LIMIT}.`}
              value={parameters.maxFiles}
              onChange={this.onParameterChange.bind(this, 'maxFiles')}
            />
          </Form>
          <pre>{JSON.stringify(parameters, null, 2)}</pre>
        </Typography>
      </>
    );
  }
}
