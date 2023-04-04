export const isDag = (adjacentList: Map<string, string[]>) => {
  const visited = new Set<string>()
  const visiting = new Set<string>()
  const visit = (node: string) => {
    if (visiting.has(node)) {
      return false
    }
    if (visited.has(node)) {
      return true
    }
    visiting.add(node)
    for (const adjacent of adjacentList.get(node) || []) {
      if (!visit(adjacent)) {
        return false
      }
    }
    visiting.delete(node)
    visited.add(node)
    return true
  }
  for (const node of adjacentList.keys()) {
    if (!visit(node)) {
      return false
    }
  }
  return true
}

export const topologySort = (adjacencyList: Map<string, string[]>): Array<string> => {
  // Store the visited nodes and the result (topologically sorted nodes)
  const visited: Set<string> = new Set();
  const result: Array<string> = [];

  // Helper function for DFS traversal
  const dfs = (node: string) => {
    // Mark the current node as visited
    visited.add(node);

    // Iterate adjacent nodes
    const adjacentNodes = adjacencyList.get(node);
    if (adjacentNodes) {
      for (const adjacentNode of adjacentNodes) {
        // If the adjacent node is not visited, call the DFS function with the adjacent node
        if (!visited.has(adjacentNode)) {
          dfs(adjacentNode);
        }
      }
    }

    // Add the current node to the result (topologically sorted nodes)
    result.unshift(node);
  };

  // Iterate through each node in the adjacency list
  for (const node of adjacencyList.keys()) {
    // If the node is not visited, apply the DFS function to the node
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  return result;
}
