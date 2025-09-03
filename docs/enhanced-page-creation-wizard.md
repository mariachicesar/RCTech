# Enhanced PageCreationWizard with AI Content Generation

## Overview
The `PageCreationWizard` has been enhanced to include AI-powered content generation capabilities from the ChatGPT page feature. This allows users to generate content ideas, full articles, and SEO metadata automatically.

## Features Added

### 1. AI Content Generation Step
- New optional step 2 that appears when `enableAIContent={true}`
- Form to input business details for AI content generation
- Real-time chat interface for AI interaction

### 2. Automatic Content Population
- AI-generated content is automatically filled into the page
- SEO metadata (title, description, keywords) auto-populated
- Content preview in the final step

### 3. Three-Step Wizard Flow
When AI content is enabled:
1. **Type & Template** - Select page type and template
2. **AI Content** - Generate AI content (optional)
3. **Page Details** - Review and finalize page details

When AI content is disabled (default):
1. **Type & Template** - Select page type and template  
2. **Page Details** - Fill in page details manually

## Usage

### Basic Usage (No AI)
```tsx
<PageCreationWizard
  onCreatePage={handleCreatePage}
  onCancel={handleCancel}
  isLoading={isCreating}
/>
```

### Enhanced Usage (With AI Content)
```tsx
<PageCreationWizard
  onCreatePage={handleCreatePage}
  onCancel={handleCancel}
  isLoading={isCreating}
  enableAIContent={true}  // Enables AI content generation
/>
```

## AI Content Generation Process

1. **User fills business details:**
   - Website URL
   - City/Location
   - Industry
   - Target Keyword
   - Competitor URLs
   - Service/Topic

2. **AI generates content ideas:**
   - Multiple content ideas presented as clickable cards
   - Each idea includes keyword targets

3. **User selects an idea:**
   - AI generates complete content strategy
   - Includes outline, full markdown content, competitor analysis, SEO metadata

4. **Auto-population:**
   - Page title, meta description, keywords auto-filled
   - Content ready for page creation

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCreatePage` | `(data: PageCreationData & { content?: string }) => void` | - | Callback when page is created |
| `onCancel` | `() => void` | - | Callback when wizard is cancelled |
| `isLoading` | `boolean` | `false` | Show loading state during page creation |
| `enableAIContent` | `boolean` | `false` | Enable AI content generation step |

## Benefits

- **Streamlined workflow**: Generate content and create pages in one flow
- **SEO optimization**: AI generates optimized titles, descriptions, and keywords
- **Time saving**: Reduces manual content creation time
- **Consistency**: Ensures proper page structure and metadata

## Migration from ChatGPT Page

The AI functionality has been integrated from the standalone ChatGPT page (`/chat-gpt`). Users can now:
- Generate content directly within the page creation process
- Skip the separate ChatGPT page workflow
- Have content and metadata automatically applied to new pages
