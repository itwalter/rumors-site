import React from 'react';
import Link from 'next/link';
import { t, jt } from 'ttag';
import gql from 'graphql-tag';

import { format, formatDistanceToNow } from 'lib/dateWithLocale';
import { TYPE_NAME, TYPE_DESC } from '../constants/replyType';
import { USER_REFERENCE } from '../constants/urls';
import ExpandableText from './ExpandableText';
import { nl2br, linkify } from 'lib/text';
import { sectionStyle } from './ReplyConnection.styles';
import ReplyFeedback from './ReplyFeedback';
import EditorName from './EditorName';
import Hyperlinks from './Hyperlinks';
import CopyButton from './CopyButton';

const ArticleReplyData = gql`
  fragment ArticleReplyData on ArticleReply {
    # articleId and replyId are required to identify ArticleReply instances
    articleId
    replyId
    canUpdateStatus
    createdAt
    reply {
      id
      type
      text
      reference
      user {
        id
        name
        level
      }
      hyperlinks {
        ...HyperlinkData
      }
    }
    user {
      id
      name
      level
    }
    ...ArticleReplyFeedbackData
  }
  ${Hyperlinks.fragments.HyperlinkData}
  ${ReplyFeedback.fragments.ArticleReplyFeedbackData}
`;

const ArticleReplyForUser = gql`
  fragment ArticleReplyForUser on ArticleReply {
    # articleId and replyId are required to identify ArticleReply instances
    articleId
    replyId
    canUpdateStatus
    ...ArticleReplyFeedbackForUser
  }
  ${ReplyFeedback.fragments.ArticleReplyFeedbackForUser}
`;

class ArticleReply extends React.PureComponent {
  static defaultProps = {
    articleReply: {},
    disabled: false,
    onAction() {},
    actionText: '',
    showActionOnlyWhenCanUpdate: true, // If false, show action button for everyone
    linkToReply: true,
    showFeedback: true,
  };

  handleAction = () => {
    const { articleReply, onAction } = this.props;
    return onAction(articleReply);
  };

  renderHint = () => {
    const { articleReply } = this.props;
    const replyType = articleReply.reply.type;

    if (replyType !== 'NOT_ARTICLE') return null;

    const refLink = (
      <a
        key="ref"
        href={USER_REFERENCE}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t`“Editor Manual”`}
      </a>
    );

    return (
      <aside className="not-in-range-info">
        ／ {jt`Please refer to ${refLink} for what to fact-check.`}
        <style jsx>{`
          .not-in-range-info {
            display: inline-block; /* line-break as a whole in small screen */
            margin-left: 0.5em;
            font-size: 12px;
            opacity: 0.75;
          }
        `}</style>
      </aside>
    );
  };

  renderFooter = () => {
    const {
      articleReply,
      disabled,
      actionText,
      linkToReply,
      showActionOnlyWhenCanUpdate,
      showFeedback,
    } = this.props;
    const createdAt = new Date(articleReply.createdAt);
    const timeAgoStr = formatDistanceToNow(createdAt);
    const timeEl = (
      <span title={format(createdAt, 'Pp')}>{t`${timeAgoStr} ago`}</span>
    );

    const { reply } = articleReply;

    const copyText =
      typeof window !== 'undefined'
        ? `${TYPE_NAME[reply.type]} \n【${t`Reason`}】${(
            reply.text || ''
          ).trim()}\n↓${t`Details`}↓\n${
            window.location.href
          }\n↓${t`Reference`}↓\n${reply.reference}`
        : '';

    return (
      <footer>
        {linkToReply ? (
          <Link href="/reply/[id]" as={`/reply/${articleReply.reply.id}`}>
            <a>{timeEl}</a>
          </Link>
        ) : (
          timeEl
        )}
        {articleReply.canUpdateStatus || !showActionOnlyWhenCanUpdate ? (
          <>
            {' '}
            ・{' '}
            <button disabled={disabled} onClick={this.handleAction}>
              {actionText}
            </button>
          </>
        ) : (
          ''
        )}
        <CopyButton content={copyText} />
        {showFeedback && <ReplyFeedback articleReply={articleReply} />}
      </footer>
    );
  };

  renderAuthor = () => {
    const { articleReply } = this.props;
    const reply = articleReply.reply;
    const articleReplyAuthor = articleReply.user;
    const replyAuthor = reply.user;

    const articleReplyAuthorName =
      (
        <EditorName
          key="editor"
          editorName={articleReplyAuthor?.name}
          editorLevel={articleReplyAuthor?.level}
        />
      ) || t`Someone`;

    const originalAuthorElem = (
      <EditorName
        key="editorName"
        editorName={replyAuthor?.name}
        editorLevel={replyAuthor?.level}
      />
    );
    const originalAuthorsReply = (
      <Link key="originalReply" href="/reply/[id]" as={`/reply/${reply.id}`}>
        <a>{jt`${originalAuthorElem}'s reply`}</a>
      </Link>
    );

    if (replyAuthor?.name && articleReplyAuthor?.id !== replyAuthor?.id) {
      return (
        <span key="editor">
          {jt`${articleReplyAuthorName} uses ${originalAuthorsReply} to`}
        </span>
      );
    }

    return articleReplyAuthorName;
  };

  renderReference = () => {
    const { articleReply } = this.props;
    const replyType = articleReply.reply.type;
    if (replyType === 'NOT_ARTICLE') return null;

    const reference = articleReply.reply.reference;
    return (
      <section className="section">
        <h3>
          {replyType === 'OPINIONATED' ? t`Different opinion` : t`Reference`}
        </h3>
        {reference
          ? nl2br(linkify(reference))
          : `⚠️️ ${t`There is no reference for this reply. Its truthfulness may be doubtful.`}`}

        <Hyperlinks
          hyperlinks={articleReply.reply.hyperlinks}
          pollingType="replies"
          pollingId={articleReply.replyId}
        />
        <style jsx>{sectionStyle}</style>
      </section>
    );
  };

  render() {
    const { articleReply } = this.props;
    const reply = articleReply.reply;
    const replyType = reply.type;

    const authorElem = this.renderAuthor();
    const typeElem = (
      <strong key="type" title={TYPE_DESC[replyType]}>
        {TYPE_NAME[replyType]}
      </strong>
    );

    return (
      <li className="root">
        <header className="section">
          {jt`${authorElem} mark the message as ${typeElem}`}
          {this.renderHint()}
        </header>
        <section className="section">
          <h3>{t`Reason`}</h3>
          <ExpandableText>{nl2br(linkify(reply.text))}</ExpandableText>
        </section>

        {this.renderReference()}
        {this.renderFooter()}

        <style jsx>{`
          .root {
            padding: 24px;
            border: 1px solid #ccc;
            border-top: 0;
          }
          .root:first-child {
            border-top: 1px solid #ccc;
          }
          .root:hover {
            background: rgba(0, 0, 0, 0.05);
          }
        `}</style>
        <style jsx>{sectionStyle}</style>
      </li>
    );
  }
}

ArticleReply.fragments = {
  ArticleReplyData,
  ArticleReplyForUser,
};

export default ArticleReply;
