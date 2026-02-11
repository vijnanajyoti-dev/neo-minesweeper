# Contributing to Neo-Minesweeper

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment**: OS, browser, device
- **Version**: App version number

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. iOS 15, Android 12]
 - Browser: [e.g. Chrome 98, Safari 15]
 - Device: [e.g. iPhone 13, Pixel 6]
 - Version: [e.g. 1.0.0]

**Additional context**
Any other information about the problem.
```

### Suggesting Features

Feature requests are welcome! Please include:

- **Clear title and description**
- **Use case**: Why is this feature needed?
- **Proposed solution**
- **Alternatives considered**
- **Mockups/examples** (if applicable)

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. I'm frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Screenshots, mockups, or examples.
```

### Pull Requests

1. **Fork the repository**
2. **Create a branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

**PR Guidelines:**

- Follow the existing code style
- Write clear commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass
- Keep PRs focused (one feature per PR)
- Link related issues

**PR Template:**

```markdown
## Description
Describe your changes in detail.

## Related Issue
Fixes #(issue number)

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe the tests you ran.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

## Development Setup

### Prerequisites

- Node.js 16+
- Yarn
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/neo-minesweeper.git
cd neo-minesweeper

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/neo-minesweeper.git

# Install dependencies
cd frontend
yarn install

# Start development server
yarn start
```

### Staying Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your main
git checkout main
git merge upstream/main

# Update your fork
git push origin main
```

## Code Style

### JavaScript/React

- **ES6+ syntax**
- **Functional components** with hooks
- **Named exports** for components
- **Default exports** for pages
- **camelCase** for variables and functions
- **PascalCase** for components

**Example:**

```javascript
// Good
export const GameBoard = ({ size, onCellClick }) => {
  const [grid, setGrid] = useState([]);
  
  useEffect(() => {
    initializeGrid();
  }, [size]);
  
  return (
    <div className="game-board">
      {/* Board content */}
    </div>
  );
};

// Avoid
class GameBoard extends Component {
  // Class components
}
```

### CSS/Styling

- **Tailwind CSS** for styling
- **Avoid inline styles** (except dynamic values)
- **Mobile-first** responsive design
- **Meaningful class names**

**Example:**

```jsx
// Good
<button className="py-3 px-6 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600">
  Start Game
</button>

// Avoid
<button style={{ padding: '12px 24px', borderRadius: '12px' }}>
  Start Game
</button>
```

### File Organization

```
components/
├── game/              # Game-specific components
├── ui/                # Reusable UI components
└── layout/            # Layout components

contexts/
├── GameContext.js     # Game state management
└── ThemeContext.js    # Theme management

utils/
├── analytics.js       # Analytics functions
├── storage.js         # Storage functions
└── helpers.js         # Helper functions
```

### Testing

- Write tests for new features
- Update tests for changed functionality
- Aim for 80%+ code coverage

**Test Example:**

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Cell } from './Cell';

describe('Cell Component', () => {
  test('renders hidden cell', () => {
    const cell = { isRevealed: false, isMine: false };
    render(<Cell row={0} col={0} cell={cell} />);
    
    const cellElement = screen.getByTestId('cell-0-0');
    expect(cellElement).toBeInTheDocument();
  });
  
  test('reveals cell on click', () => {
    const cell = { isRevealed: false, isMine: false };
    const onReveal = jest.fn();
    
    render(<Cell row={0} col={0} cell={cell} onReveal={onReveal} />);
    
    fireEvent.click(screen.getByTestId('cell-0-0'));
    expect(onReveal).toHaveBeenCalledWith(0, 0);
  });
});
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semi-colons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or correcting tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(game): add hard difficulty level

fix(cell): prevent double-click on revealed cells

docs(readme): update installation instructions

style(board): format code according to prettier rules

refactor(context): simplify game state management

perf(board): optimize cell rendering performance

test(game): add tests for win condition

chore(deps): update dependencies
```

## Documentation

- Update README.md for user-facing changes
- Update code comments for complex logic
- Update API documentation for API changes
- Add JSDoc comments for functions:

```javascript
/**
 * Initializes the game grid with specified dimensions
 * @param {number} rows - Number of rows in the grid
 * @param {number} cols - Number of columns in the grid
 * @param {number} mineCount - Number of mines to place
 * @returns {Array} 2D array representing the game grid
 */
function initializeGrid(rows, cols, mineCount) {
  // Implementation
}
```

## Review Process

1. **Automated Checks**: CI/CD runs automatically
2. **Code Review**: Maintainer reviews code
3. **Testing**: Reviewer tests functionality
4. **Feedback**: Reviewer provides feedback
5. **Updates**: Contributor makes requested changes
6. **Approval**: Maintainer approves PR
7. **Merge**: PR is merged into main branch

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks in documentation

## Questions?

- **General**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Security**: Email security@your-domain.com
- **Other**: Email contributors@your-domain.com

---

**Thank you for contributing! 🎉**