# Core
Core includes a range of styles, variables and code that form the foundation of how the Design System works, including colour, typography and spacing.

## Color
The colour palette is designed and tested to provide colour pairings that pass accessibility contrast ratios while still being easy to implement. This means that designers and developers using the system do not need to be concerned about if a colour will pass WCAG requirements in a particular circumstance.

### Colour names imply their use
We use use semantic naming so that all colours labeled as `foreground` colours in a theme, are automatically tested to pass accessibility contrast ratios when used with all `background` colours within a theme and vice versa.

### Tips
- Do pair foreground and background colours.
- Don't Mix light and dark variables.
- Don't pair foreground with foreground or background with background.

## Typography
A typographic scale was used to create a set of font-sizes and line-heights which have been designed for legibility and can be easily be implemented by designers or developers with a predictable output.

Using the design system's typography values means any object containing text is more likely to align with another element. This appearance of a baseline grid is created by automatically rounding the line-heights to the nearest grid value `4px`, then converting them back to a unit-less value.

To ensure consistency with other components in the system:

- Designers can use font-size and line-height values from the typographic scale.
- Developers can use the `AU-fontgrid` function in SCSS.

[Why does the design system use system fonts?](https://designsystem.gov.au/components/core/rationale/#why-system-fonts)

## Spacing
The consistent alignment of elements is paramount for good UI design. The design system provides functions in SCSS so that designers and developers can work together with predictable outcomes.

The base-unit `1unit` of spacing in the design system is derived from `1rem` which in most browsers equates to `16px`.

### Design software
For doing mockups in software like Sketch or Photoshop, use pixel values which are divisible by 4.

### Development
Developers should use AU-fontgrid and AU-space SCSS functions.

The AU-space accepts a default unnamed unit `1unit` and outputs a scalable / accessible value `1rem` as well as a fallback for older browsers `16px`.