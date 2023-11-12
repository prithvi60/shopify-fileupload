import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  SpacingBackground,
  Placeholder
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);
  // const generateProduct = () => submit({}, { replace: true, method: "POST" });
  const arrayToMapOver = [1, 2, 3, 4, 5, 6];
  return (
    <Page>
      <ui-title-bar title="Design Files from Customer">
        <button variant="primary" onClick={()=>shopify.toast.show("Loaded latest files")} >
          Refresh Files
        </button>
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Latest Files
                  </Text>
                </BlockStack>
                <BlockStack gap="200">
          {arrayToMapOver.map((item,idx)=>
          (
      <InlineStack gap="600" wrap={false} blockAlign="center" key={idx}>
      <Box>
      <Text as="h3" variant="headingMd">
               {idx+1}. demo file {idx+1}
              </Text>
              </Box>
              <Box>
      <Text as="h3" variant="headingMd">
                1{arrayToMapOver.length - idx+1}- 11- 2023
              </Text>
              </Box>
              <Box>

              <a variant="primary" href={"https://theprintguy-customerfiles.s3.ap-south-1.amazonaws.com/zip"}>
                Download
              </a>
              </Box>
      </InlineStack>
          ))}

      </BlockStack>

              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
