package com.OMEL.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "customer")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "regno")
    private String regno;

    @Basic(optional = false)
    @Column(name = "fname")
    private String fname;

    @Basic(optional = false)
    @Column(name = "lname")
    private String lname;

    @Basic(optional = false)
    @Column(name = "nic")
    private String nic;

    @Basic(optional = true)
    @Column(name = "email")
    private String email;

    @Basic(optional = false)
    @Column(name = "mobileno")
    private Integer mobileno;

    @Basic(optional = true)
    @Column(name = "landno")
    private Integer landno;

    @Basic(optional = false)
    @Column(name = "address")
    private String address;

    @Basic(optional = true)
    @Column(name = "points")
    private BigDecimal points;

    @Basic(optional = false)
    @Column(name = "addeddate")
    private LocalDate addeddate;

    @Basic(optional = true)
    @Column(name = "description")
    private String description;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "customerstatus_id1" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private CustomerStatus customerstatus_id1;


    public Customer(String regno) {
        this.regno = regno;
    }

    public Customer(Integer id , String fname , String lname , Integer mobileno ,BigDecimal points){
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.mobileno = mobileno;
        this.points = points;
    }
}
