# Contributing to React Passkey Pro

Thank you for your interest in contributing to React Passkey Pro! 🎉

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Git

### Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/yourusername/react-passkey.git
cd react-passkey
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the library**
```bash
npm run build
```

4. **Run tests**
```bash
npm test
```

5. **Start the example app**
```bash
cd example
npm install
npm run dev
```

## 🎯 Ways to Contribute

### 🐛 Bug Reports
- Use the [bug report template](https://github.com/esmat-nawahda/react-passkey/issues/new?template=bug_report.md)
- Include browser, OS, and React version
- Provide minimal reproduction case
- Include error messages and stack traces

### 💡 Feature Requests
- Use the [feature request template](https://github.com/esmat-nawahda/react-passkey/issues/new?template=feature_request.md)
- Explain the use case and motivation
- Consider backward compatibility
- Provide implementation ideas if possible

### 📝 Documentation
- Fix typos and improve clarity
- Add examples and use cases
- Update API documentation
- Create tutorials and guides

### 🧪 Testing
- Add test cases for new features
- Improve existing test coverage
- Test on different browsers and devices
- Add integration tests

### 🎨 UI/UX Improvements
- Enhance component styling
- Improve accessibility 
- Add animations and transitions
- Create new component variants

## 📋 Development Guidelines

### Code Style
- Follow existing code style
- Use TypeScript for all new code
- Add JSDoc comments for public APIs
- Use meaningful variable and function names

### Testing Requirements
- Write tests for all new features
- Maintain or improve test coverage
- Use Jest and React Testing Library
- Mock external dependencies properly

### Commit Messages
We use [Conventional Commits](https://conventionalcommits.org/):

```
feat: add new PasskeyButton variant
fix: resolve authentication timeout issue
docs: update installation instructions
test: add unit tests for usePasskey hook
chore: update dependencies
```

### Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

2. **Make your changes**
- Follow coding guidelines
- Add tests for new functionality
- Update documentation

3. **Test your changes**
```bash
npm test
npm run build
cd example && npm run build
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add amazing feature"
```

5. **Push to your fork**
```bash
git push origin feature/amazing-feature
```

6. **Create a Pull Request**
- Use the pull request template
- Link related issues
- Provide clear description
- Add screenshots/GIFs if UI changes

## 🏗️ Project Structure

```
react-passkey/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── hooks/             # React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   └── index.ts           # Main export
├── example/               # Example application
├── dist/                  # Built library
├── src/__tests__/         # Test files
└── docs/                  # Documentation
```

## 🔍 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Guidelines
- Test both success and error cases
- Mock WebAuthn APIs properly
- Use meaningful test descriptions
- Group related tests with `describe`
- Clean up after tests with `afterEach`

## 📦 Release Process

1. Version bump in `package.json`
2. Update `CHANGELOG.md`
3. Create GitHub release
4. Publish to npm
5. Deploy demo to GitHub Pages

## 🎉 Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes
- Social media announcements
- Documentation credits

## 💬 Getting Help

- 💬 [GitHub Discussions](https://github.com/esmat-nawahda/react-passkey/discussions)
- 🐛 [Issue Tracker](https://github.com/esmat-nawahda/react-passkey/issues)
- 📧 Email: maintainer@react-passkey-pro.dev

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

Thank you for making React Passkey Pro better! 🙏