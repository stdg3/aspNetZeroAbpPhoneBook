## <%= project.name %> UI has the following changes

<% suites.forEach(suite => { %>

### <%= suite.title %>

<% suite.specs.forEach(spec => { %>

#### ▸ <%= spec.title %>

<% spec.errors.forEach(error => { %>

<%
let errorDetails = error.details.reduce((acc, detail) => acc + detail + '\n', '');
if (error.screenshots) {
errorDetails = '';
%>
![diff (access needed)](<%= generatePath(error.screenshots.diff) %>)

[Latest](<%= generatePath(error.screenshots.approved) %>)
<% } %>

<%= errorDetails %>

---

<%});});});%>

End of report
