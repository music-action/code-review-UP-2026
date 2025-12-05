# Exo 3


## Refactorings

- REVUE DE CODE: identify magic strings and numbers
  - REFACTORING : Introduce constant and/or use constant already defined but not used everywhere

## Tips

- Check the code coverage is enough to detect any unintended behaviour changes

### While refactoring

- Stay in the green while refactoring
  - Run the tests after each refactor
    - Check all tests still pass
    - Check code coverage has not dropped
- Commit after each refactor
- In case of persistent test fails, use `git reset` to go back to green
