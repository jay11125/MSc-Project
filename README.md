# Document Chat App 

This project involves creating a document chat application and it researches on two topics: Fine-tuning and RAG implementation. The Fine-Tuning folder included fine-tuning implementation of BERT and LLaMA models. The RAG-APP folder involves a backend server running on the QMUL's Apocrita HPC cluster and a frontend React application running locally. The backend is implemented using Flask, and the frontend is developed with React. We will run the frontend app on our local machine and the backend on the cluster. The backend and frontend will communicate via SSH local port forwarding. Before reading further, I assume you have access to the Apocrita HPC cluster, if not then please refer to the [documentation](https://docs.hpc.qmul.ac.uk/intro/hpc-account/)

## Setup Instructions

### Apocrita HPC Cluster Setup

1. **Access the HPC Cluster:**
   - Use SSH to access the HPC cluster where the backend will be running. [Link](https://docs.hpc.qmul.ac.uk/intro/login/#ssh-access-via-the-terminal)

2. **Set Up Python Environment:**
   - After successful login to the cluster from your terminal, load the anaconda library from the cluster using ([Link](https://docs.hpc.qmul.ac.uk/apps/languages/anaconda/#loading-the-module)):
     ```bash
     module load anaconda3
     ```
     This will allow you to use conda commands for creating environments and installing libraries.
   - Create a virtual environment to manage dependencies:
     ```bash
     conda create --name env-name
     source activate env-name
     ```
   - After activating the environment, you need to install pytorch library in the following way to utilize the GPU in python:
     ```bash
     conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch-nightly -c nvidia
     ```
   - For this project to use the LlamaCpp library, you need to install cxx-compiler library in the following way:
     ```bash
     conda install -c conda-forge cxx-compiler
     ```
   - To use this environment as a kernel while fine-tuning LLMs in jupyter notebook, you need to install ipykernel library and create a kernel in the following way:
     ```bash
     conda install ipykernel
     python -m ipykernel install --user --name kernel_name
     ```
   - Finally, install all the required libraries using the requirements.txt file present in the root directory.
     ```bash
     pip install -r requirements.txt
     ```
   - This will install all the libraries required by fine-tuning as well as RAG system.
 
 - Now you can try to run the fine-tuning code and the RAG code as explained below.


## Fine-Tuning Setup

After setting up the python environments you can try to run the notebooks available in the Fine-Tuning folder. You should use the Apocrita's [OnDemand](https://docs.hpc.qmul.ac.uk/ondemand/) feature to access the Jupyter Notebook running on a GPU. OnDemand also allows you to upload files or folders that you would run in the session. Upload the Fine-Tuning and RAG folders in the [home](https://docs.hpc.qmul.ac.uk/storage/#home-directories) directory of the cluster.

 When you create a new Jupyter Notebook (GPU) session, it will ask you few configurations to select before starting the session. From the below list, GPU type and CUDNN module are the important parameters to set before starting a session.
  - Anaconda 3 version - 2023.03 (or latest)
  - Maximum running time (hrs) - Depends on your HPC account type and permission. I had 1hr maximum running time allowed.
  - GPU type restriction - **hopper (important)**, because it has maximum GPU memory (~80GB) compared to others (ampere, volta). Hence, select hopper from the dropdown.
  - CUDNN module - **8.9.4-cuda12.2 (important)**. This is the CUDA version of the driver of the cluster's GPU. This version(cuda 12.2) is not compatible with the default pytorch library hence we installed pytorch library seperately as instructed previously.

After setting the above config, launch the session and wait for your turn in the queue. After that you can start the session and open the jupyter notebooks. Select the kernel that you created previously using the virtual environment. Once the kernel is selected you can start running the cells one by one and perform the fine-tuning of the LLMs.


## RAG APP Setup

For running the RAG app you need to follow the same steps as fine-tuning setup mentioned above. This will allow you to access the GPU using the queue system easily using OnDemand's web interface instead of command line interface. After starting the Jupyter Notebook GPU session on cluster you can access the [rdg node](https://docs.hpc.qmul.ac.uk/nodes/rdg/) if you selected the above mentioned configuration for the GPU session. To check this, you can open a new terminal after launching the session and verify the command line prompt which will appear as *[your_hpc_username@rdg1 ~]*. This may be different in your case, so just make sure you update the following code accordingly.

Now you must open a new terminal on your local machine where you will also run your frontend. Now to listen to port 8000 of the cluster we should run the following code in our local machine:
```bash
ssh -L 8000:localhost:8000 -J your_hpc_username@login.hpc.qmul.ac.uk your_hpc_username@rdg1
```
It will ask for your cluster password and after that you can access the cluster via the terminal of your local machine. The port is now forwarded from cluster's 8000 to your local machine's 8000 port. Now you should again load the anaconda library and activate the previously created environment.

### Running RAG Backend

1. **Run the Flask Server:**
   - Navigate to the backend directory and start the Flask server:
     ```bash
     cd ./RAG/RAG-APP/rag-backend
     python run.py
     ```
   - This will start the server on the cluster at port 8000.

2. **Testing the Flask Application:**
   - To run all the tests of the backend server, run:
     ```bash
     pytest
     ```
3. **Access the Backend API:**
   - With port forwarding set up, you can now access the backend APIs at `http://localhost:8000` from your local machine.


### Running RAG Frontend

1. **Install Node.js and npm:**
   - Ensure Node.js and npm are installed on your local machine. You can download them from [nodejs.org](https://nodejs.org/).
   
2. **Install Frontend Dependencies:**
   - Navigate to the frontend directory and install the required npm packages:
     ```bash
     cd ./RAG/RAG-APP/rag-frontend
     npm install
     ```

3. **Run the React Application:**
   - Start the React application on port 3000:
     ```bash
     npm start
     ```

4. **Testing the React Application:**
   - To run all the tests of the frontend application, run:
     ```bash
     npm test
     ```
    
You can now go to `https://localhost:3000` and use the RAG application.


For any questions or issues, please contact me at [e23781@qmul.ac.uk](mailto:e23781@qmul.ac.uk).