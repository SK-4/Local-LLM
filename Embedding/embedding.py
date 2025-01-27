import ollama
import numpy as np
from scipy.spatial.distance import cosine

# Function to generate embeddings using the nomic-embed-text model
def generate_embedding(text):
    response = ollama.embeddings(model="nomic-embed-text", prompt=text)
    return np.array(response['embedding'])

# List of sample documents (this could be from a real dataset)
documents = [
    "Machine learning is a field of artificial intelligence.",
    "Deep learning is a subset of machine learning.",
    "Natural language processing is a key area in AI research.",
    "Reinforcement learning involves training models through rewards.",
    "Deep Reinforcement "

]

# Generate embeddings for all documents
document_embeddings = [generate_embedding(doc) for doc in documents]

# Function to find the most similar document to a query
def find_most_similar_document(query, document_embeddings, documents):
    # Generate embedding for the query
    query_embedding = generate_embedding(query)
    
    # Compute cosine similarity between query and each document
    similarities = []
    for doc_embedding in document_embeddings:
        similarity = 1 - cosine(query_embedding, doc_embedding)  # Cosine similarity
        similarities.append(similarity)
    
    most_similar_idx = np.argmax(similarities)
    return documents[most_similar_idx], similarities[most_similar_idx]

# Example query
query = "What is deep learning in artificial intelligence?"

# Find the most similar document to the query
most_similar_doc, similarity_score = find_most_similar_document(query, document_embeddings, documents)

print(f"Query: {query}")
print(f"Most Similar Document: {most_similar_doc}")
print(f"Similarity Score: {similarity_score:.4f}")
