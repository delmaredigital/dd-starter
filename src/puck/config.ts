'use client'

import { fullConfig } from '@delmaredigital/payload-puck/config/editor'

/**
 * Puck Editor Configuration
 *
 * Uses the full built-in config which includes:
 * - Section, Flex, Grid, Columns
 * - Heading, Text, RichText
 * - Button, Image, Video
 * - Spacer, Divider
 *
 * Extend this with custom components as needed:
 *
 * import { extendConfig } from '@delmaredigital/payload-puck/config/editor'
 *
 * export const customConfig = extendConfig({
 *   base: fullConfig,
 *   components: {
 *     MyComponent: MyComponentConfig,
 *   },
 *   categories: {
 *     custom: {
 *       title: 'Custom',
 *       components: ['MyComponent'],
 *     },
 *   },
 * })
 */
export const puckConfig = fullConfig
