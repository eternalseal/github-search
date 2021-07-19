import React, { useState, useEffect } from "react";
import * as axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  AboutWidget,
  RepositoryInfoWidget,
  ReadMeWidget,
} from "../components/Widgets";
import Progress from "../components/Progress";

export default (props) => {
  const [repo, setRepo] = useState({});
  const [readMe, setReadMe] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingReadMe, setLoadingReadMe] = useState(true);

  const params = props.match.params;
  const { owner, name } = params;

  const getReadme = async (owner, name, fileName, index) => {
    const fileNames = [
      "readme.md",
      "README.md",
      "REadme.md",
      "REAdme.md",
      "READMe.md",
      "README.md",
      "README.Md",
      "Readme.MD",
    ];
    try {
      if (fileName || typeof index === "undefined") {
        fileName = fileName || fileNames[0];
        const rawGithubBase = "https://raw.githubusercontent.com/";
        const link = `${rawGithubBase}/${owner}/${name}/master/${fileName}`;
        const results = await axios.get(link);
        setReadMe(results.data);
        setLoadingReadMe(false);
      } else {
        setLoadingReadMe(false);
      }
    } catch (error) {
      index = index || 0;
      const fileName = fileNames[index + 1];
      return getReadme(owner, name, fileName, index + 1);
    }
  };

  const getRepo = async (owner, name) => {
    try {
      const githubBase = "https://api.github.com";
      const results = await axios.get(`${githubBase}/repos/${owner}/${name}`, {
        headers: {
          accept: "application/vnd.github.v3+json",
        },
      });
      if (results && results.data) {
        getReadme(owner, name);
        return results.data;
      } else {
        return {};
      }
    } catch (error) {
      return {};
    }
  };

  useEffect(() => {
    let mounted = true;
    getRepo(owner, name).then((data) => {
      setRepo(data);
      setLoading(false);
    });
    return () => (mounted = false);
  }, []);
  return (
    <>
      <div className="table-settings mb-4">
        {loading ? (
          <React.Fragment>
            <Progress variant="info" label="Fetching Data..." size="md" />
          </React.Fragment>
        ) : (
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap py-4">
            {loadingReadMe ? (
              <React.Fragment>
                <Progress
                  variant="info"
                  label="Getting Repo ReadMe..."
                  size="md"
                />
              </React.Fragment>
            ) : readMe !== "" ? (
              <ReadMeWidget readMe={readMe} name={repo.name} />
            ) : (
              <RepositoryInfoWidget repo={repo} />
            )}
            <AboutWidget {...repo} />
          </div>
        )}
      </div>
    </>
  );
};
