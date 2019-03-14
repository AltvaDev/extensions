import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Paragraph } from '@contentful/forma-36-react-components';

import './ImageTaggingHelp.css'

const getContentTypeUrl = (contentType) => {
  const spaceId = contentType.sys.space.sys.id;
  const contentTypeId = contentType.sys.id;

  return `https://app.contentful.com/spaces/${spaceId}/content_types/${contentTypeId}/fields`
};

export class ImageTaggingHelp extends React.Component {
  static propTypes = {
    contentType: PropTypes.object.isRequired,
    hasImageField: PropTypes.bool.isRequired,
    hasTagField: PropTypes.bool.isRequired
  };

  render = () => {
    const { hasImageField, hasTagField, contentType } = this.props;

    return (
      <div>
        <Paragraph element='p' extraClassNames={'f36-color--text-light'}>
          To be able to use image auto tagging, add the following fields to your content type <a
            href={getContentTypeUrl(contentType)}
            target='_blank'
          >{contentType.name}</a>:</Paragraph>
        <List>
          { !hasImageField ?
            <ListItem extraClassNames='help_list__item'>A 'Media' field as the image source</ListItem> : null }
          { !hasTagField ?
            <ListItem extraClassNames='help_list__item'>A 'Short text, list' field to store the tags</ListItem> : null }
        </List>
      </div>
    )
  }
}