import { useEffect, useState } from "react";
// import { json } from "@remix-run/node";
// import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  Box,
  InlineStack,
} from "@shopify/polaris";
// import { authenticate } from "../shopify.server";
import {
  ListObjectsCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

// export const loader = async ({ request }) => {
//   await authenticate.admin(request);

//   return null;
// };

// export const action = async ({ request }) => {
//   const { admin } = await authenticate.admin(request);
//   const color = ["Red", "Orange", "Yellow", "Green"][
//     Math.floor(Math.random() * 4)
//   ];
//   const response = await admin.graphql(
//     `#graphql
//       mutation populateProduct($input: ProductInput!) {
//         productCreate(input: $input) {
//           product {
//             id
//             title
//             handle
//             status
//             variants(first: 10) {
//               edges {
//                 node {
//                   id
//                   price
//                   barcode
//                   createdAt
//                 }
//               }
//             }
//           }
//         }
//       }`,
//     {
//       variables: {
//         input: {
//           title: `${color} Snowboard`,
//           variants: [{ price: Math.random() * 100 }],
//         },
//       },
//     }
//   );
//   const responseJson = await response.json();

//   return json({
//     product: responseJson.data.productCreate.product,
//   });
// };

export default function Index() {

  const [files, setFiles] = useState([]);

  useEffect(() => {
    const client = new S3Client({
      region: "ap-south-1",
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "eu-north-1" },
        identityPoolId: "eu-north-1:6882a53f-ea7c-49cb-b0b6-bea5052ec264",
      }),
    });
    const command = new ListObjectsCommand({
      Bucket: "theprintguy-customerfiles",
      ExpectedBucketOwner: "200994887321",
    });
    client.send(command).then(({ Contents }) => setFiles(Contents || []));
  }, []);
  return (
    <Page>
      <ui-title-bar title="Design Files from Customer">
        <button
          variant="primary"
          onClick={() => shopify.toast.show("Loaded latest files")}
        >
          Refresh Files
        </button>
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <InlineStack gap="600" wrap={false} blockAlign="center">
                    <Box>
                      <Text as="h2" variant="headingMd">
                        Design Files
                      </Text>
                    </Box>
                    <Box>
                      <Text as="h2" variant="headingMd">
                        Uploaded date
                      </Text>
                    </Box>
                    <Box>
                      <Text as="h2" variant="headingMd">
                        File Size
                      </Text>
                    </Box>
                    <Box>
                      <Text as="h2" variant="headingMd">
                        Action
                      </Text>
                    </Box>
                  </InlineStack>

                  {files.map((item, idx) => {
                    // Split the date string into an array of strings, using whitespace as the delimiter.
                    const dateParts = String(item.LastModified).split(/\s+/);

                    // Get the day, month, and year from the date parts.
                    const day = dateParts[2];
                    const month = dateParts[1];
                    const year = dateParts[3];
                    return (
                      <InlineStack
                        gap="600"
                        wrap={false}
                        blockAlign="center"
                        key={item.ETag}
                      >
                        <Box>
                          <Text as="h3" variant="headingSm">
                            {idx + 1}. {item.Key}
                          </Text>
                        </Box>
                        <Box>
                          <Text as="h3" variant="headingSm">
                            {`${day} ${month} ${year}`}
                          </Text>
                        </Box>
                        <Box>
                          <Text as="h3" variant="headingSm">
                            {item.Size}KB
                          </Text>
                        </Box>
                        <Box>
                          <a
                            variant="primary"
                            href={`https://theprintguy-customerfiles.s3.ap-south-1.amazonaws.com/${item.Key}`}
                          >
                            Download
                          </a>
                        </Box>
                      </InlineStack>
                    );
                  })}
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
