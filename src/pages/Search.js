import React, { useState } from "react";
import * as axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, InputGroup } from "@themesberg/react-bootstrap";

import Progress from "../components/Progress";
import {
  RepositoryInfoWidget,
} from "../components/Widgets";

import { sortOptions, languages } from "../data/constants";

export default () => {
  const [keyword, setKeyword] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [sortOption, setSortOption] = useState(sortOptions[0].sort);
  const [language, setLanguage] = useState(languages[0]);
  const [loading, setLoading] = useState(false);

  // Check and modify data based on what week the user selected
  const searchRepos = async () => {
    try {
      if (!keyword || keyword === "") return false;
      if (!loading) setLoading(true);

      const q = encodeURIComponent(keyword);
      const sortObject = sortOptions.find((o) => o.id === sortOption);
      const sort = sortObject.sort;
      const order = sortObject.order;
      const githubBase = "https://api.github.com";
      const query = {
        q,
        sort,
        order,
      };

      if (language && language !== "") query.q += `language:${language}`;

      const results = await axios.get(`${githubBase}/search/repositories`, {
        headers: {
          accept: "application/vnd.github.v3+json",
        },
        params: query,
      });
      if (results && results.data) {
        setRepositories(results.data.items);
      } else {
        setRepositories([]);
      }
      setLoading(false);
    } catch (error) {
      setRepositories([]);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <h4>Search Github</h4>
        </div>
      </div>
      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col xs={12} md={12} lg={6} xl={6}>
            <Form.Group className="mb-3">
              <Form.Label>Search or jump to...</Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => (e.key === "Enter" ? searchRepos() : false)}
                  type="text"
                  placeholder="Search"
                />
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} onClick={searchRepos} />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col xs={6} md={6} lg={3} xl={3}>
            <Form.Group className="mt-3">
              <InputGroup>
                <InputGroup.Text>Sort:</InputGroup.Text>
                <Form.Select
                  defaultValue={sortOptions[0]}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    searchRepos();
                  }}
                >
                  {sortOptions.map((option) => (
                    <option value={option.id} key={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col xs={6} md={6} lg={3} xl={3}>
            <Form.Group className="mt-3">
              <InputGroup>
                <InputGroup.Text>Language:</InputGroup.Text>
                <Form.Select
                  defaultValue={languages[0]}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    searchRepos();
                  }}
                >
                  {languages.map((option) => (
                    <option value={option} key={"lanuage-" + option}>
                      {option === "" ? "Popular" : option}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        {loading ? (
          <React.Fragment>
            <Progress variant="info" label="Searching..." size="md" />
          </React.Fragment>
        ) : repositories.length ? (
          repositories.map((repo) => (
            <Row key={repo.id}>
              <Col xs={8}>
                <RepositoryInfoWidget repo={repo} />
              </Col>
            </Row>
          ))
        ) : null}
      </div>
    </>
  );
};
