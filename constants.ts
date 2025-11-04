import { Department, ContributionType } from './types';

export const MOCK_DATA: Department[] = [
  {
    id: 'dept-cs',
    name: 'Computer Science',
    subjects: [
      {
        id: 'subj-ds',
        name: 'Data Structures Lab',
        code: 'CS301L',
        experiments: [
          {
            id: 'exp-ds-1',
            title: 'Implement a Stack using Arrays',
            objective: 'To understand and implement the Last-In-First-Out (LIFO) behavior of a stack data structure using a static array.',
            contributions: [
              {
                id: 'c1',
                author: 'Jane Doe',
                type: ContributionType.Code,
                content: `
#include <iostream>
#define MAX_SIZE 101
using namespace std;

class Stack {
private:
    int A[MAX_SIZE];
    int top;
public:
    Stack() {
        top = -1;
    }
    void Push(int x) {
        if (top == MAX_SIZE - 1) {
            cout << "Error: stack overflow\\n";
            return;
        }
        A[++top] = x;
    }
    void Pop() {
        if (top == -1) {
            cout << "Error: No element to pop\\n";
            return;
        }
        top--;
    }
    int Top() {
        return A[top];
    }
    int IsEmpty() {
        return top == -1;
    }
};

int main() {
    Stack S;
    S.Push(2);
    S.Push(5);
    S.Push(10);
    S.Pop();
    cout << S.Top();
}`,
                language: 'cpp',
                upvotes: 15,
                createdAt: new Date('2023-10-26T10:00:00Z'),
              },
              {
                id: 'c2',
                author: 'John Smith',
                type: ContributionType.Viva,
                question: 'What is stack overflow?',
                content: 'Stack overflow is a situation that occurs when the stack pointer exceeds the stack bound. This typically happens when there are too many function calls (e.g., in deep recursion) or when trying to push an element onto a full stack in an array-based implementation.',
                upvotes: 22,
                createdAt: new Date('2023-10-26T11:20:00Z'),
              },
              {
                id: 'c3',
                author: 'Admin',
                type: ContributionType.Diagram,
                content: 'Stack Push & Pop Operation',
                imageUrl: 'https://picsum.photos/seed/stack/600/400',
                upvotes: 8,
                createdAt: new Date('2023-10-25T15:00:00Z'),
              }
            ],
          },
          {
            id: 'exp-ds-2',
            title: 'Implement a Queue using Linked List',
            objective: 'To implement the First-In-First-Out (FIFO) principle of a queue using a dynamic linked list.',
            contributions: [],
          },
          {
            id: 'exp-ds-3',
            title: 'Binary Search Tree (BST) Implementation',
            objective: 'To implement insertion, deletion, and traversal operations in a Binary Search Tree.',
            contributions: [],
          },
        ],
      },
      {
        id: 'subj-dbms',
        name: 'Database Management Systems Lab',
        code: 'CS302L',
        experiments: [
            {
                id: 'exp-dbms-1',
                title: 'SQL Queries for Data Retrieval',
                objective: 'To learn and apply various SQL SELECT statements to retrieve data from a sample database.',
                contributions: [],
            }
        ],
      },
      {
        id: 'subj-dv',
        name: 'Data Exploration and Visualization Lab',
        code: 'CS405L',
        experiments: [
            {
                id: 'exp-dv-1',
                title: 'Introduction to Pandas for Data Manipulation',
                objective: 'To learn the basics of data manipulation and cleaning using the Python Pandas library, including reading data, handling missing values, and filtering.',
                contributions: [],
            },
            {
                id: 'exp-dv-2',
                title: 'Creating Basic Plots with Matplotlib',
                objective: 'To visualize data by creating fundamental plots like line charts, bar charts, and scatter plots using the Matplotlib library in Python.',
                contributions: [],
            }
        ],
      },
    ],
  },
  {
    id: 'dept-ec',
    name: 'Electronics & Communication',
    subjects: [
      {
        id: 'subj-dld',
        name: 'Digital Logic Design Lab',
        code: 'EC201L',
        experiments: [
            {
                id: 'exp-dld-1',
                title: 'Implementation of Logic Gates',
                objective: 'To verify the truth tables of basic logic gates (AND, OR, NOT, NAND, NOR, XOR) using integrated circuits (ICs).',
                contributions: [],
            }
        ],
      },
    ],
  },
];
