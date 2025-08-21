import type { Preview } from "@storybook/react"
import React from "react"
import { Provider } from "../src/components/ui/provider"

const preview: Preview = {
  decorators: [
    (Story) => (
      <Provider>
        <Story />
      </Provider>
    ),
  ],
}

export default preview