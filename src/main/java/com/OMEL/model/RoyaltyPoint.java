package com.OMEL.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "royaltypoint")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoyaltyPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "cardname")
    private String cardname;

    @Basic(optional = false)
    @Column(name = "startrange")
    private BigDecimal startrange;

    @Basic(optional = false)
    @Column(name = "stoprange")
    private BigDecimal stoprange;

    @Basic(optional = false)
    @Column(name = "addedpoint")
    private BigDecimal addedpoint;

    @Basic(optional = false)
    @Column(name = "discount")
    private BigDecimal discount;


}
