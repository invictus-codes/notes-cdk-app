import {exec} from "child_process";
import {join} from "path";
import {readFileSync, unlinkSync, writeFileSync} from "fs";

(async () => {
  const cdkOutputsFile = join(
    __dirname,
    `tmp.${Math.ceil(Math.random() * 10 ** 10)}.json`
  );
  const configFile = join(__dirname, "..", "frontend", "src", "config.json");

  try {
    const execProcess = exec(
      `pnpm cdk deploy --outputs-file ${cdkOutputsFile} --profile invictus`,
      {
        cwd: join(__dirname, "..", "infra"),
      }
    );
    execProcess.stdout?.pipe(process.stdout);
    execProcess.stderr?.pipe(process.stderr);
    await new Promise((resolve) => {
      execProcess.on("exit", resolve);
    });
  } catch (error) {
    console.log(`cdk command failed: ${error}`);
  }

  // Populate frontend config with data from outputsFile
  try {
    const configContents = JSON.parse(readFileSync(configFile).toString());
    const cdkOutput = JSON.parse(readFileSync(cdkOutputsFile).toString())[
      "aws-sdk-js-notes-app"
    ];
    configContents.FILES_BUCKET = cdkOutput.FilesBucket;
    configContents.GATEWAY_URL = cdkOutput.GatewayUrl;
    configContents.IDENTITY_POOL_ID = cdkOutput.IdentityPoolId;
    configContents.REGION = cdkOutput.Region;
    writeFileSync(configFile, JSON.stringify(configContents, null, 2));
  } catch (error) {
    console.log(`Error while updating config.json: ${error}`);
  }

  // Delete outputsFile
  unlinkSync(cdkOutputsFile);
})();
