import streamlit as st
from langchain_openai import ChatOpenAI
from browser_use import Agent
import asyncio
import nest_asyncio

nest_asyncio.apply()

async def run_task(task: str):
    # Initialize the agent with the provided task and model details
    agent = Agent(
        task=task,
        llm=ChatOpenAI(model="gpt-4o", api_key="Your_API_KEY"),
    )
    
    result = await agent.run()
    return result.final_result()


def main():
    st.title("Browser-use Operator Demo")
    
    # Input field for task description
    task_input = st.text_area("Enter your task:", "Go to Swiggy change location to Thane, Search dal makhani and get me the prices from Lunchbox Meals.") 
    
    # Button to trigger the task execution
    if st.button("Run Task"):
        if task_input:
            # Run the task asynchronously
            result = asyncio.run(run_task(task_input))
            st.write("Task Result:", result)
        else:
            st.error("Please enter a task!")

if __name__ == "__main__":
    main()
