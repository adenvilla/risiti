# Verification

Run python3 tests/verify_package.py from a repository checkout. Python 3 standard library is sufficient; Node.js is optional for JavaScript syntax checks.

The script exits nonzero for missing files, invalid PNG headers/dimensions, broken local entry-point/import references or detected JavaScript syntax errors. It reads files and does not alter application storage.

A passing result does not verify payment correctness, authentication, accessibility, service-worker behaviour or complete browser workflows. Full browser smoke tests and regenerated screenshots remain pending transfer.
