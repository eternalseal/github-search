import React from "react";
import moment from "moment-timezone";
import gfm from "remark-gfm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactMarkdown from "react-markdown";
import {
  faPaperclip,
  faBookOpen,
  faUserPlus,
  faStar,
  faBalanceScale,
} from "@fortawesome/free-solid-svg-icons";

import { Card, Image, Button } from "@themesberg/react-bootstrap";

export const RepositoryInfoWidget = (props) => {
  const { repo } = props;
  const { owner } = repo;

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">
          <a href={`/#/details/${repo.owner.login}/${repo.name}`}>
            {repo.full_name}
          </a>
        </h5>
        <div className="d-xl-flex align-items-center">
          <div className="user-avatar xl-avatar">
            <Image fluid rounded src={owner.avatar_url} />
          </div>
          <div className="file-field">
            <div className="d-flex justify-content-xl-center ms-xl-3">
              <div className="d-flex">
                <div className="d-md-block text-start">
                  <div className="fw-normal text-dark mb-1">
                    {repo.description}
                  </div>

                  <div className="text-gray small">
                    <span className="spaced">
                      <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
                      {repo.stargazers_count}
                    </span>

                    <span className="spaced">{repo.language}</span>
                    {repo.license ? (
                      <span className="spaced">{repo.license.name}</span>
                    ) : null}
                    <span className="spaced">
                      Updated on{" "}
                      {moment(repo.updated_at).format("MMM DD, YYYY")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export const ReadMeWidget = (props) => {
  const { readMe } = props;
  return (
    <Card border="light" className="shadow-sm" style={{ maxWidth: "840px" }}>
      <Card.Header>
        <Card.Title>Readme</Card.Title>
      </Card.Header>
      <Card.Body>
        <ReactMarkdown remarkPlugins={[gfm]}>{readMe}</ReactMarkdown>
      </Card.Body>
    </Card>
  );
};

export const AboutWidget = (props) => {
  const { description, html_url, license } = props;
  return (
    <Card border="light" className="shadow-sm">
      <Card.Body>
        <h5>About</h5>
        <p>{description}</p>
        <div className="d-block">
          <div className="d-flex align-items-center pt-3 me-5">
            <div className="icon icon-shape icon-sm icon-shape-danger rounded me-3">
              <FontAwesomeIcon icon={faPaperclip} />
            </div>
            <div className="d-block">
              <h6 className="mb-0">
                <a href={html_url}>{html_url}</a>
              </h6>
            </div>
          </div>
          <div className="d-flex align-items-center pt-3">
            <div className="icon icon-shape icon-sm icon-shape-quaternary rounded me-3">
              <FontAwesomeIcon icon={faBookOpen} />
            </div>
            <div className="d-block">
              <h6 className="mb-0">
                {" "}
                <a href={html_url + "#readme"}>Readme</a>
              </h6>
            </div>
          </div>
          {license ? (
            <div className="d-flex align-items-center pt-3">
              <div className="icon icon-shape icon-sm icon-shape-quaternary rounded me-3">
                <FontAwesomeIcon icon={faBalanceScale} />
              </div>
              <div className="d-block">
                <h6 className="mb-0">
                  {" "}
                  <a href={license.url}>{license.name}</a>
                </h6>
              </div>
            </div>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
};
