import { execSync } from "child_process";

export type NormalOption = {
  name: string;
  tag: string;
  ghrOptions: string[];
};

export type ErrorOption = {
  message: string;
  exitCode: number;
};

export function isError(
  option: NormalOption | ErrorOption
): option is ErrorOption {
  return "message" in option;
}

export function configureGhrOption(
  branch: string | undefined,
  tag: string | undefined,
  manifestVersion: string,
  manifestVersionName: string,
  packageVersion: string
): NormalOption | ErrorOption {
  if (branch) {
    const ghrOptions = ["-prerelease", "-recreate"];
    let optionName;
    let optionTag;
    if (branch.endsWith("-prototype")) {
      optionTag = branch;
      optionName = branch;
    } else {
      optionTag = "snapshot";
      optionName = `v${manifestVersion}-snapshot`;
    }

    return { name: optionName, tag: optionTag, ghrOptions: ghrOptions };
  } else if (tag) {
    if (tag === "snapshot") {
      return {
        message: "ignore `snapshot` tag (already released)",
        exitCode: 0,
      };
    }

    if (tag !== `v${manifestVersion}`) {
      const message = `tag(${tag}) != 'v' + manifest_version(${manifestVersion})`;
      return { message: message, exitCode: 1 };
    }

    if (manifestVersion !== packageVersion) {
      const message = `manifest_version(${manifestVersion}) != package_version(${packageVersion})`;
      return { message: message, exitCode: 1 };
    }

    if (manifestVersionName) {
      return { message: "version_name exists", exitCode: 1 };
    }

    const ghrOptions = ["-recreate"];
    return { name: tag, tag: tag, ghrOptions: ghrOptions };
  } else {
    const ghrOptions = ["-recreate"];
    const optionTag = getGitBranch();
    const optionName = "snapshot";
    return { name: optionName, tag: optionTag, ghrOptions: ghrOptions };
  }
}

function getGitBranch() {
  const result = execSync("git symbolic-ref --short HEAD");
  return result.toString().trim();
}
